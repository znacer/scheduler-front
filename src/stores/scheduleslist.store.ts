import { makeAutoObservable, runInAction } from "mobx";
import { ScheduleList } from "../scheduler/types";
import { endpointCall, RouterEnum } from "../scheduler/endpoint";

class SchedulesListStore {

  list: Map<string, ScheduleList> = new Map()

  constructor() {
    this.updateList();
    makeAutoObservable(this);
  }

  async updateList() {
    const data = await endpointCall(RouterEnum.listSchedules, {});
    runInAction(() => {
      (data as ScheduleList[]).forEach((elt: ScheduleList) => {
        this.list.set(elt.id, elt);
      });
    })

  }

  keys(): Array<string> {
    return Array.from(this.list.keys())
  }

}

const schedulesListStore = new SchedulesListStore();

export default schedulesListStore;
