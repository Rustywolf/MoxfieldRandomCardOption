import Hook from "./Hook";
import GrabFunctionsHook from "./GrabFunctionsHook";
import { error, getRandomCard } from "../utils";

export default class AddButtonHook extends Hook {

  functions: GrabFunctionsHook;

  constructor(functions: GrabFunctionsHook) {
    super("AddButton");
    this.functions = functions;
  }

  inject(): boolean {
    const battlefieldDiv =
      Array.from(document.querySelectorAll(".battlefield"))
        .find(element => element.parentElement?.parentElement?.parentElement?.parentElement?.id === "js-reactroot");
    if (!battlefieldDiv) {
      error("Couldn't find correct .player element");
      return false;
    }

    const buttonList = battlefieldDiv.nextElementSibling;
    if (!buttonList) {
      error("Couldn't find Button List element");
      return false;
    }

    let addTokenButton: Element;
    let shuffleButton: Element;
    Array.from(buttonList.children).forEach(child => {
      if (child.textContent === "Add Token") {
        addTokenButton = child;
      } else if (child.textContent === "Shuffle") {
        shuffleButton = child;
      }
    });

    if (!addTokenButton) {
      error("Unable to find Token Button element");
      return false;
    }

    if (!shuffleButton) {
      error("Unable to find Shuffle Button element");
      return false;
    }

    const randomCardButton = document.createElement("div");
    randomCardButton.className = shuffleButton.className;
    randomCardButton.textContent = "Random Card";
    buttonList.insertBefore(randomCardButton, addTokenButton.nextSibling);
    randomCardButton.addEventListener("click", async () => {
      const card = await getRandomCard();
      if (card) {
        this.functions.addToken(card);
      } else {
        alert("There was an issue fetching a card, please try again.");
      }
    });

    return true;
  }

}