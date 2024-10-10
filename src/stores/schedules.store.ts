import { makeAutoObservable, runInAction } from "mobx";
import { Schedule, TaskData } from "../scheduler/types";
import { endpointCall, RouterEnum } from "../scheduler/endpoint";
import schedulesListStore from "./scheduleslist.store";

class ScheduleStore {

  schedules: Map<string, Schedule> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  refresh(schedules: Schedule[]) {
    schedules.forEach((schedule: Schedule) => {
      this.schedules.set(schedule.id, schedule)
    })
  }

  setSchedulesFromRow(schedule: Schedule) {
    this.schedules.set(schedule.id, schedule)
  }

  updateTask(item: TaskData) {
    const updatedSchedule_id = Array.from(this.schedules.keys()).find((schedule_id: string) => this.schedules.get(schedule_id)?.data?.includes(item));
    if (updatedSchedule_id === undefined) {
      return;
    }
    const updatedSchedule = this.schedules.get(updatedSchedule_id)
    if (updatedSchedule === undefined) {
      return;
    }
    updatedSchedule.data = updatedSchedule.data.map((task: TaskData) => {
      if (task.id === item.id) {
        return item;
      }
      return task
    })
    this.schedules.set(updatedSchedule_id, updatedSchedule);
  }
  addTask(schedule_id: string, item: TaskData) {
    const updatedSchedule = this.schedules.get(schedule_id)
    if (updatedSchedule === undefined) {
      return;
    }
    updatedSchedule.data.push(item);
    this.schedules.set(schedule_id, updatedSchedule);
  }

  async updateSchedule(item: Schedule) {
    endpointCall(RouterEnum.updateSchedule, item);
    runInAction(() => {
      this.schedules.set(item.id, item)
    })
  }

  removeTask(item: TaskData) {
    const updatedSchedule_id = Array.from(this.schedules.keys()).find((schedule_id: string) => this.schedules.get(schedule_id)?.data?.includes(item));
    if (updatedSchedule_id === undefined) {
      return;
    }
    const updatedSchedule = this.schedules.get(updatedSchedule_id)
    if (updatedSchedule === undefined) {
      return;
    }
    updatedSchedule.data = updatedSchedule.data.filter((task: TaskData) => task.id !== item.id)
    this.schedules.set(updatedSchedule_id, updatedSchedule);
  }

  async removeSchedule(schedule_id: string) {
    endpointCall(RouterEnum.removeSchedule, { "id": schedule_id });
    runInAction(() => {
      this.schedules.delete(schedule_id);
    })
  }

  reset() {
    this.schedules = new Map();
  }

  addSchedule(schedule: Schedule) {
    this.schedules.set(schedule.id, schedule);
  }

  aslist(): Array<Schedule> {
    return Array.from(this.schedules.values());
  }
}

const schedulesStore = new ScheduleStore();

export default schedulesStore;
