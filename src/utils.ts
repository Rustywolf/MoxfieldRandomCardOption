export const MRCO_VERSION_ID = "MRCOVersion";

const CARDS_CACHE_KEY = "MRCOWeightedCards";
const CACHE_TIMEOUT = 1000 * 60 * 60 * 24 * 28;
const SEARCH_ATTEMPTS_MAX = 10;
const SEARCH_ATTEMPT_DELAY = 50;

export function error(message: string) {
  console.log(`[MRCO] ${message}`);
}

async function search(name: string): Promise<MoxfieldSearchResponse> {
  const qs = new URLSearchParams({
    q: name,
    page: "1",
  });
  const res = await fetch(`https://api2.moxfield.com/v2/cards/search?${qs.toString()}`);
  const json = await res.json() as MoxfieldSearchResponse;
  return json;
}

async function getTopCards(): Promise<WeightedCards> {
  const version = (document.getElementById(MRCO_VERSION_ID) as HTMLInputElement).value;
  const cachedCardsJson = window.localStorage.getItem(CARDS_CACHE_KEY);
  if (cachedCardsJson) {
    const cachedCards = JSON.parse(cachedCardsJson) as (undefined | WeightedCards);
    if (cachedCards && cachedCards.version === version && cachedCards.timestamp + CACHE_TIMEOUT > Date.now()) {
      return cachedCards;
    }
  }

  const cardsRes = await fetch("https://json.edhrec.com/pages/top/year.json");
  const cardsJson = await cardsRes.json() as EdhrecTopCards;
  const landsRes = await fetch("https://json.edhrec.com/pages/top/lands.json");
  const landsJson = await landsRes.json() as EdhrecTopCards;

  const totalDecks = cardsJson.cardlist.find(card => card.name === "Sol Ring").potential_decks;

  const cardNames: string[] = [];
  const cardWeights: number[] = [];
  let currentWeight = 0;
  for (let card of cardsJson.cardlist) {
    currentWeight += card.num_decks / totalDecks;
    cardNames.push(card.name);
    cardWeights.push(currentWeight);
  }

  const landNames: string[] = [];
  const landWeights: number[] = [];
  currentWeight = 0;
  for (let land of landsJson.cardlist) {
    let standardWeight = land.num_decks / totalDecks;
    if (["Mountain", "Swamp", "Island", "Forest", "Plains"].includes(land.name)) {
      standardWeight *= 10;
    }
    currentWeight += standardWeight;
    landNames.push(land.name);
    landWeights.push(currentWeight);
  }

  const weightedCards: WeightedCards = {
    cards: {
      names: cardNames,
      weights: cardWeights
    },
    lands: {
      names: landNames,
      weights: landWeights,
    },
    timestamp: Date.now(),
    version,
  }

  window.localStorage.setItem(CARDS_CACHE_KEY, JSON.stringify(weightedCards));

  return weightedCards;
}

async function attemptGetCard(): Promise<MoxfieldCard | undefined> {
  const topCards = await getTopCards();
  const useLands = Math.random() < .35;
  const { names, weights } = useLands ? topCards.lands : topCards.cards;
  let randomValue = Math.random() * weights[weights.length - 1];
  let name = "";
  for (let i = 0; i < weights.length; i++) {
    if (randomValue < weights[i]) {
      name = names[i];
      break;
    }
  }

  const card = (await search(name)).data.find(c => c.name === name);
  return card;
}

export async function getRandomCard(): Promise<MoxfieldCard | undefined> {
  let attempts = 0;
  while (attempts < SEARCH_ATTEMPTS_MAX) {
    try {
      const card = await attemptGetCard();
      if (card) {
        return card;
      }
    } catch (e) {
      console.error(e);
    }
    attempts++;
    await new Promise(r => setTimeout(r, SEARCH_ATTEMPT_DELAY));
  }

  error("Unable to create random card");
}