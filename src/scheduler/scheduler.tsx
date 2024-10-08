import { Scheduler } from "@bitnoi.se/react-scheduler";
import { useCallback, useState } from "react";
import moment from "moment";
import { observer } from "mobx-react"

import { TaskModal } from "./taskmodal";
import { TaskData, Schedule } from "./types";
import { Box, Button } from "@mui/material";
import { ScheduleDrawer } from "./drawer";
import { RowModal } from "./rowmodal";
import schedulesStore from "../stores/schedules.store";

export const Component = observer(() => {
  const [filterButtonState, setFilterButtonState] = useState(0);

  //modals
  const [openTaskModal, setOpenTaskModal] = useState(false);
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
  const handleOpenTask = () => setOpenTaskModal(true);
  const handleCloseTask = () => setOpenTaskModal(false);

  const [openRowModal, setOpenRowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Schedule>();

  const handleOpenRow = () => setOpenRowModal(true);
  const handleCloseRow = () => setOpenRowModal(false);

  //layout options
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: new Date()
  });

  const handleRangeChange = useCallback((range: { startDate: Date, endDate: Date }) => {
    setRange(range);
  }, []);

  // Filtering events that are included in current date range
  const filteredScheduleData = schedulesStore.schedules.map((person: Schedule) => ({
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
            handleOpenTask();
          }}
          onItemClick={(item) => {
            console.log(item);
            setSelectedRow(schedulesStore.schedules.find((schedule: Schedule) => schedule.id === item.id));
            handleOpenRow();
          }}
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
            showThemeToggle: true,
          }}
        />
      </Box>
      <ScheduleDrawer
        open={openSideBar}
        handleClose={toggleDrawer(false)}
      />
      <Button onClick={toggleDrawer(true)}>Open drawer</Button>
      <TaskModal
        open={openTaskModal}
        handleClose={handleCloseTask}
        selectedItem={selectedItem}
      />
      <RowModal
        open={openRowModal}
        handleClose={handleCloseRow}
        selectedItem={selectedRow}
        setOpenTaskModal={handleOpenTask}
        setSelectedItem={setSelectedItem}
      />
    </Box>
  );
})

export default Component;
