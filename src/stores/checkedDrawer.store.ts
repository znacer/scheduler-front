import { makeAutoObservable } from "mobx";

class CheckDrawer {

  list: Set<string> = new Set();

  constructor() {
    makeAutoObservable(this);
  }

  check(uid: string) {
    this.list.add(uid);
  }

  uncheck(uid: string) {
    this.list.delete(uid);
  }

}

const checkDrawer = new CheckDrawer();

export default checkDrawer;
