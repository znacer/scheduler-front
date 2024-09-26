import React, { useEffect } from "react";
import { Scheduler } from "@bitnoi.se/react-scheduler";
import { useCallback, useState } from "react";
import moment from "moment";

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type Data = {
  id: string,
  startDate: Date,
  endDate: Date,
  occupancy: number,
  title: string,
  subtitle: string,
  description: string,
  bgColor: string,
}

type MockedSchedule = {
  id: string,
  label: {
    icon: string,
    title: string,
    subtitle: string,
  },
  data: Data[]

}
export function Component() {
  const [filterButtonState, setFilterButtonState] = useState(0);

  //modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // fetch data from backend
  const [mockedSchedulerData, setData] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:3000/scheduler-service/test")
      .then((res) => res.json())
      .then((fetchedData) => {
        console.log(fetchedData);
        setData(fetchedData);
      }).catch((err) => {
        console.error(err.message);
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
  const filteredMockedSchedulerData = mockedSchedulerData.map((person: MockedSchedule) => ({
    ...person,
    data: person.data.filter(
      (project: Data) =>
        // we use "dayjs" for date calculations, but feel free to use library of your choice
        moment(project.startDate).isBetween(range.startDate, range.endDate) ||
        moment(project.endDate).isBetween(range.startDate, range.endDate) ||
        (moment(project.startDate).isBefore(range.startDate, "day") &&
          moment(project.endDate).isAfter(range.endDate, "day"))
    )
  }))

  return (
    <div>
      <Scheduler
        data={filteredMockedSchedulerData}
        onRangeChange={handleRangeChange}
        // onTileClick={(clickedResource) => console.log(clickedResource)}
        onTileClick={handleOpen}
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
        }}
      />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Box>
        </Fade>
      </Modal>    </div>
  );
}

export default Component;
