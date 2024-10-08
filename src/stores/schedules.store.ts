import { makeAutoObservable } from "mobx";
import { Schedule, TaskData } from "../scheduler/types";

class ScheduleStore {

  schedules: Schedule[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  refresh(schedules: Schedule[]) {
    this.schedules = schedules;
  }

  setSchedulesFromRow(item: Schedule) {
    this.schedules = schedulesStore.schedules.map((schedule: Schedule) => {
      if (schedule.id === item.id) {
        schedule.label = item.label
      }
      return schedule;
    });
  }

  updateTask(item: TaskData) {
    this.schedules = this.schedules.map((schedule: Schedule) => {
      schedule.data = schedule.data.map((elt: TaskData) => {
        if (elt.id === item.id) {
          elt = item
        }
        return elt;
      });
      return schedule;
    });
  }

  updateSchedule(item: Schedule) {
    this.schedules = this.schedules.map((schedule: Schedule) => {
      if (schedule.id === item.id) {
        schedule.label = item.label
      }
      return schedule;
    });
  }

  removeTask(itemId: string) {
    this.schedules = this.schedules.map((schedule: Schedule) => {
      schedule.data = schedule.data.filter((elt: TaskData) => elt.id !== itemId);
      return schedule;
    });
  }

}

const schedulesStore = new ScheduleStore();

export default schedulesStore;
