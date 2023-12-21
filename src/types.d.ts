interface MoxfieldCard {
  id: string;
  uniqueCardId: string;
  scryfall_id: string;
  set: string;
  set_name: string;
  name: string;
  cn: string;
  layout: string;
  cmc: number;
  type: string;
  type_line: string;
  oracle_text: string;
  mana_cost: string;
  power: string;
  toughness: string;
  colors: string[];
  color_indicator: string[];
  color_identity: string[];
  legalities: {
    standard: string;
    future: string;
    historic: string;
    timeless: string;
    gladiator: string;
    pioneer: string;
    explorer: string;
    modern: string;
    legacy: string;
    pauper: string;
    vintage: string;
    penny: string;
    commander: string;
    oathbreaker: string;
    brawl: string;
    historicbrawl: string;
    alchemy: string;
    paupercommander: string;
    duel: string;
    oldschool: string;
    premodern: string;
    predh: string
  };
  frame: string;
  reserved: boolean;
  digital: boolean;
  foil: boolean;
  nonfoil: boolean;
  etched: boolean;
  glossy: boolean;
  rarity: string;
  border_color: string;
  colorshifted: boolean;
  flavor_text: string;
  lang: string;
  latest: boolean;
  has_multiple_editions: boolean;
  has_arena_legal: boolean;
  prices: {
    usd: number;
    usd_foil: number;
    eur: number;
    eur_foil: number;
    tix: number;
    ck: number;
    ck_foil: number;
    lastUpdatedAtUtc: string;
    ck_buy: number;
    ck_buy_foil: number;
    ct: number;
    ct_foil: number
  };
  card_faces: string[];
  artist: string;
  promo_types: string[];
  cardHoarderUrl: string;
  cardKingdomUrl: string;
  cardKingdomFoilUrl: string;
  cardMarketUrl: string;
  tcgPlayerUrl: string;
  isArenaLegal: boolean;
  released_at: string;
  edhrec_rank: number;
  multiverse_ids: number[];
  cardmarket_id: number;
  mtgo_id: number;
  tcgplayer_id: number;
  cardkingdom_id: number;
  cardkingdom_foil_id: number;
  reprint: boolean;
  set_type: string;
  coolStuffIncUrl: string;
  coolStuffIncFoilUrl: string;
  acorn: boolean;
  image_seq: number;
  cardTraderUrl: string;
  cardTraderFoilUrl: string;
  isToken: boolean;
  defaultFinish: string;
}

interface MoxfieldSearchResponse {
  hasMore: boolean;
  totalCards: number;
  data: MoxfieldCard[];
}

interface EdhrecCard {
  name: string;
  sanitized: string;
  sanitized_wo: string;
  url: string;
  num_decks: number;
  potential_decks: number;
}

interface EdhrecCardView extends EdhrecCard {
  inclusion: number;
  label: string;
}

interface EdhrecTopCards {
  header: string;
  description: string;
  container: {
    description: null | string;
    json_dict: {
      cardlists: {
        cardviews: EdhrecCardView[];
      }[]
    }
    keywords: string;
    title: string;
  };
  cardlist: EdhrecCard[];
}

interface WeightedCards {
  cards: {
    names: string[];
    weights: number[];
  };
  lands: {
    names: string[];
    weights: number[];
  };
  timestamp: number;
  version: string;
}