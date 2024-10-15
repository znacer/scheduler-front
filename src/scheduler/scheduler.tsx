import { Scheduler } from "@bitnoi.se/react-scheduler";
import { Box } from "@mui/material";
import { useCallback, useState } from "react";
import moment from "moment";
import 'dayjs/locale/fr';
import frDayjsTranslations from "dayjs/locale/fr";
import { observer } from "mobx-react"

import { TaskModal } from "./taskmodal";
import { TaskData, Schedule, LocaleType } from "./types";
import { ScheduleDrawer } from "./drawer";
import { RowModal } from "./rowmodal";
import { NewPlanModal } from "./newplanmodal";
import schedulesStore from "../stores/schedules.store";
import selectedItemStore from "../stores/selectedItem.store";
import schedulesListStore from "../stores/scheduleslist.store";
import dayjs from "dayjs";

dayjs.locale("fr");
const langs: LocaleType[] = [
  {
    id: "fr",
    lang: {
      feelingEmpty: "Faire clic droit pour afficher la liste des linéaires",
      free: "Libre",
      loadNext: "Suivant",
      loadPrevious: "Précédent",
      over: "over",
      taken: "occupé",
      topbar: {
        filters: "Filtres",
        next: "suivant",
        prev: "précédent",
        today: "Aujourd'hui",
        view: "Vue"
      },
      search: "recherche",
      week: "Semaine"
    },
    translateCode: "fr-FR",
    dayjsTranslations: frDayjsTranslations
  }
];

export const SchedulerComponent = observer(() => {
  const [filterButtonState, setFilterButtonState] = useState(0);

  //modals
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const handleOpenTask = () => setOpenTaskModal(true);
  const handleCloseTask = () => setOpenTaskModal(false);

  const [openRowModal, setOpenRowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Schedule>();

  const handleOpenRow = () => setOpenRowModal(true);
  const handleCloseRow = () => setOpenRowModal(false);

  const [openNewPlanModal, setNewPlanModal] = useState(false);
  const handleOpenNewPlan = () => {
    setNewPlanModal(true);
  }

  const handleCloseNewPlan = () => setNewPlanModal(false);
  //layout options
  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: new Date()
  });

  const handleRangeChange = useCallback((range: { startDate: Date, endDate: Date }) => {
    setRange(range);
  }, []);

  // Filtering events that are included in current date range
  const filteredScheduleData = schedulesStore.aslist().map((person: Schedule) => ({
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
    schedulesListStore.updateList();
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
          minWidth: 0.9 * window.innerWidth + 'px',
        }}
      >
        <Scheduler
          data={filteredScheduleData}
          onRangeChange={handleRangeChange}
          onTileClick={(item) => {
            // setSelectedItem(item as TaskData);
            selectedItemStore.setItem(item as TaskData)
            handleOpenTask();
          }}
          onItemClick={(item) => {
            setSelectedRow(schedulesStore.aslist().find((schedule: Schedule) => schedule.id === item.id));
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
            translations: langs,
            lang: 'fr'
          }}
        />
      </Box>
      <ScheduleDrawer
        open={openSideBar}
        handleClose={toggleDrawer(false)}
        handleOpenNewPlan={handleOpenNewPlan}
      />
      <TaskModal
        open={openTaskModal}
        handleClose={handleCloseTask}
        selectedRow={selectedRow}
      />
      <RowModal
        open={openRowModal}
        handleClose={handleCloseRow}
        selectedRow={selectedRow}
        setOpenTaskModal={handleOpenTask}
      />
      <NewPlanModal
        open={openNewPlanModal}
        handleClose={handleCloseNewPlan}
      />
    </Box>
  );
})

export default SchedulerComponent;
