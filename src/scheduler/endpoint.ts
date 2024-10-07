import { Schedule } from "./types";

const serviceAddress = "http://127.0.0.1:3000/";
export enum RouterEnum {
  fetchAll = "scheduler/fetch-all",
  test = "scheduler/test",
  updateTask = "scheduler/update-task",
  updateSchedule = "scheduler/update-schedule",
}
export async function endpointCall(route: RouterEnum, payload: object): Promise<Schedule[]> {
  let data: Schedule[] = [];
  if ([RouterEnum.fetchAll, RouterEnum.test].indexOf(route) > -1) {
    const res = await fetch(serviceAddress + route.valueOf());
    data = await res.json();
  } else if ([RouterEnum.updateTask, RouterEnum.updateSchedule].indexOf(route) > - 1) {
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

  }
  return data;
}
