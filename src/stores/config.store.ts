import { makeAutoObservable, runInAction } from "mobx";

type ConfigMap = {
  backendUrl: string
}

class ConfigStore {

  backendUrl: string = ""

  constructor() {
    makeAutoObservable(this);
  }

  async load() {

    const res = await fetch('config/config.json')
    const data: ConfigMap = await res.json();
    runInAction(() => {
      this.backendUrl = data.backendUrl
    })
  }


}

const configStore = new ConfigStore();

export default configStore;
