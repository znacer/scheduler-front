import { useEffect } from "react";
import { Scheduler } from "@bitnoi.se/react-scheduler";
import { useCallback, useState } from "react";
import moment from "moment";

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { Button, ButtonGroup, FormControl, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '2px solid ',
  boxShadow: 24,
  p: 3,
  justifyContent: "center",
  alignContent: "space-between",
  // height: 700,
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
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Data>();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // fetch data from backend
  const [mockedSchedulerData, setData] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:3000/scheduler-service/test")
      .then((res) => res.json())
      .then((fetchedData) => {
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
        onTileClick={(item) => {
          console.log(item)
          setSelectedItem(item as Data);
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
          defaultTheme: "dark"
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
          <Box component="form" sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2" align="center" >
              Details on the tile
            </Typography>
            <FormControl sx={{ width: '100%' }}>

              <TextField
                sx={{ my: 1 }}
                required
                id="outlined-required"
                label="Nom"
                defaultValue={selectedItem?.title}
              />
              <TextField
                sx={{ my: 1 }}
                required
                id="outlined-required"
                label="ID"
                defaultValue={selectedItem?.id}
              />
              <TextField
                sx={{ my: 1 }}
                required
                id="outlined-required"
                label="subtitle"
                defaultValue={selectedItem?.subtitle}
              />
              <TextField
                sx={{ my: 1 }}
                required
                id="outlined-required"
                label="description"
                defaultValue={selectedItem?.description}
              />

              <TextField
                sx={{ my: 1 }}
                required
                id="outlined-required"
                label="Couleur"
                defaultValue={selectedItem?.bgColor}
              />
              <DateTimePicker
                sx={{ my: 1 }}
                label="Date de début"
                defaultValue={moment(selectedItem?.startDate)}
              />

              <DateTimePicker
                sx={{ my: 1 }}
                label="Date de fin"
                defaultValue={moment(selectedItem?.endDate)}
              />
              <ButtonGroup variant="contained" aria-label="" sx={{ justifyContent: "end", mt: 2 }}>
                <Button>Reset</Button>
                <Button>Apply</Button>
              </ButtonGroup>
            </FormControl>
          </Box>
        </Fade>
      </Modal>

    </div>
  );
}

export default Component;
