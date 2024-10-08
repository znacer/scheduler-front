import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from 'uuid';

import { TaskData } from "../scheduler/types";

class ItemStore {

  item: TaskData;
  target_id: string | undefined;


  constructor() {
    this.item = {
      id: uuidv4(),
      title: "titre",
      subtitle: "subtitle",
      description: "",
      bgColor: "rgb(31,119,180)",
      startDate: new Date(),
      endDate: new Date(),
      occupancy: 0
    };
    this.target_id = undefined;
    makeAutoObservable(this);
  }

  newItem() {
    this.item = {
      id: uuidv4(),
      title: "titre",
      subtitle: "subtitle",
      description: "",
      bgColor: "rgb(31,119,180)",
      startDate: new Date(),
      endDate: new Date(),
      occupancy: 0
    };
    this.target_id = this.item.id;
  }

  reset() {
    this.target_id = undefined;
  }

  setItem(elt: TaskData) {
    this.item = elt;
    this.target_id = elt.id;
  }

}

const selectedItemStore = new ItemStore();

export default selectedItemStore;
