import { useEffect } from "react";
import { Scheduler } from "@bitnoi.se/react-scheduler";
import { useCallback, useState } from "react";
import moment from "moment";

import { TaskModal } from "./taskmodal";
import { TaskData, Schedule } from "./types";


const serviceAddress = "http://127.0.0.1:3000/";
enum RouterEnum {
  fetchAll = "scheduler/fetch-all",
  test = "scheduler/test"
async function endpointCall(route: RouterEnum): Promise<Schedule[]> {
  let data: Schedule[] = [];
  if ([RouterEnum.fetchAll, RouterEnum.test].indexOf(route) > -1) {
    const res = await fetch(serviceAddress + route.valueOf());
    data = await res.json();
  }
  return data;
}
export function Component() {
  const [filterButtonState, setFilterButtonState] = useState(0);

  //modal
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TaskData>();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // fetch data from backend
  const [scheduleData, setScheduleData] = useState<Schedule[]>([]);
  useEffect(() => {
    endpointCall(RouterEnum.fetchAll).then((data: Schedule[]) => {
      setScheduleData(data);
    })

  }, []);


  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: new Date()
  });

  const handleRangeChange = useCallback((range: { startDate: Date, endDate: Date }) => {
    setRange(range);
  }, []);

  // Filtering events that are included in current date range
  const filteredScheduleData = scheduleData.map((person: Schedule) => ({
    ...person,
    data: person.data.filter(
      (project: TaskData) =>
        // we use "dayjs" for date calculations, but feel free to use library of your choice
        moment(project.startDate).isBetween(range.startDate, range.endDate) ||
        moment(project.endDate).isBetween(range.startDate, range.endDate) ||
        (moment(project.startDate).isBefore(range.startDate, "day") &&
          moment(project.endDate).isAfter(range.endDate, "day"))
    )
  }))

  return (
    <div>
        }}
        <Scheduler
          data={filteredScheduleData}
          onRangeChange={handleRangeChange}
          // onTileClick={(clickedResource) => console.log(clickedResource)}
          onTileClick={(item) => {
            console.log(item)
            setSelectedItem(item as TaskData);
            handleOpen();
          }}
          onItemClick={(item) => console.log(item)}
          onFilterData={() => {
            // Some filtering logic...
            setFilterButtonState(1);
          }}
          onClearFilterData={() => {
            // Some clearing filters logic...
            setFilterButtonState(0)
          }}
          config={{
            zoom: 0,
            filterButtonState,
            showTooltip: false,
            defaultTheme: "dark",
            showThemeToggle: true
          }}
        />
      <TaskModal
        open={open}
        handleClose={handleClose}
        selectedItem={selectedItem}
      />
    </Box>
  );
}

export default Component;
