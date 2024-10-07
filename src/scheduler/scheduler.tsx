import { useEffect } from "react";
import { Scheduler } from "@bitnoi.se/react-scheduler";
import { useCallback, useState } from "react";
import moment from "moment";

import { TaskModal } from "./taskmodal";
import { TaskData, Schedule } from "./types";
import { Box, Button } from "@mui/material";
import { ScheduleDrawer } from "./drawer";

export function Component() {
  const [filterButtonState, setFilterButtonState] = useState(0);

  //modal
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TaskData>({
    id: "",
    startDate: new Date(),
    endDate: new Date(),
    occupancy: 0,
    title: "",
    subtitle: "",
    description: "",
    bgColor: "",
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //Schedule is a state to make it reactive when there is changes
  const [scheduleData, setScheduleData] = useState<Schedule[]>([]);

  const setScheduleDataFromItem = (item: TaskData) => {
    const newSchedule = scheduleData.map((schedule: Schedule) => {
      schedule.data = schedule.data.map((elt: TaskData) => {
        if (elt.id === item.id) {
          elt = item
        }
        return elt;
      });
      return schedule;
    });
    setScheduleData(newSchedule);
  }

  useEffect(() => { }, [scheduleData]);

  //layout options
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
  const [openSideBar, setOpenSideBar] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenSideBar(newOpen);
  };

  return (
    <Box
      sx={{
        p: 0,
        m: 0,
      }}
      onContextMenu={(e) => { e.preventDefault(); toggleDrawer(true)(); }}
    >
      <Box
        sx={{
          // position: "relative",
          minHeight: 0.9 * window.innerHeight + 'px',
          minWidth: window.innerWidth + 'px',

        }}
      >
        <Scheduler
          data={filteredScheduleData}
          onRangeChange={handleRangeChange}
          onTileClick={(item) => {
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
      </Box>
      <ScheduleDrawer
        open={openSideBar}
        handleClose={toggleDrawer(false)}
        setData={setScheduleData}
      />
      <Button onClick={toggleDrawer(true)}>Open drawer</Button>
      <TaskModal
        open={open}
        handleClose={handleClose}
        selectedItem={selectedItem}
        setItem={setScheduleDataFromItem}
      />
    </Box>
  );
}

export default Component;
