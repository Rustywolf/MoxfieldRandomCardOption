
export default class Hook {

  name: string;

  constructor(name: string) {
    this.name = name;
  }

  inject(): boolean {
    throw new Error("Method was not implemented");
  }

}