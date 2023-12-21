import { error } from "../utils";
import Hook from "./Hook";

export default class GrabFunctionsHook extends Hook {

  addToken: (card: MoxfieldCard) => void;

  constructor() {
    super("GrabFunction");
  }

  inject(): boolean {
    const playerDiv =
      Array.from(document.querySelectorAll(".player"))
        .find(element => element.parentElement?.parentElement?.parentElement?.id === "js-reactroot");
    if (!playerDiv) {
      error("Couldn't find correct .player element");
      return false;
    }
    
    const reactPropsKey = Object.keys(playerDiv).find(key => key.startsWith("__reactProps"));
    if (!reactPropsKey) {
      error("Couldn't find __reactProps key");
      return false;
    }

    const reactState = playerDiv[reactPropsKey]?.children?.[0]?._owner?.stateNode;
    if(!reactState) {
      error("Couldn't find react state");
      return false;
    }
        
    this.addToken = reactState.handleAddToken;
    return true;
  }

}