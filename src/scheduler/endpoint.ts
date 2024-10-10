import { Schedule, ScheduleList } from "./types";

const serviceAddress = "http://127.0.0.1:3000/";
export enum RouterEnum {
  fetchAll = "scheduler/fetch-all",
  listSchedules = "scheduler/list-schedules",
  test = "scheduler/test",
  updateTask = "scheduler/update-task",
  updateSchedule = "scheduler/update-schedule",
  fetchSchedule = "scheduler/fetch-schedule",
  newSchedule = "scheduler/new-schedule",
  removeSchedule = "scheduler/remove-schedule"
};
type Response = Schedule[] | ScheduleList[] | Schedule
export async function endpointCall(route: RouterEnum, payload: object | undefined): Promise<Response> {
  if (payload === undefined) {
    return [];
  }
  let data: Response = [];
  if ([RouterEnum.fetchAll, RouterEnum.test, RouterEnum.listSchedules].indexOf(route) > -1) {
    const res = await fetch(serviceAddress + route.valueOf());
    data = await res.json();
  } else if ([RouterEnum.updateTask, RouterEnum.updateSchedule, RouterEnum.newSchedule].indexOf(route) > - 1) {
    await fetch(serviceAddress + route.valueOf(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': "application/json",
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ ...payload }),
      mode: 'cors'
    })
  } else if ([RouterEnum.fetchSchedule].indexOf(route) > -1) {
    const res = await fetch(serviceAddress + route.valueOf(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': "application/json",
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ ...payload }),
      mode: 'cors'
    });
    data = await res.json();
  } else if ([RouterEnum.removeSchedule].indexOf(route) > -1) {
    await fetch(serviceAddress + route.valueOf(), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'accept': "application/json",
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ ...payload }),
      mode: 'cors'
    });
  }
  return data;
}

export async function endpointUpdateAllSchedules(payload: Schedule[]) {
  payload.forEach((schedule) => {
    endpointCall(RouterEnum.updateSchedule, schedule);
  })
}
