import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { Button, ButtonGroup, FormControl, TextField } from "@mui/material";
import {v4 as uuidv4 } from 'uuid';
import { Schedule, TaskData } from './types';
import { endpointCall, RouterEnum } from './endpoint';
import { Dispatch, SetStateAction } from 'react';
import schedulesStore from '../stores/schedules.store';

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

interface RowModalProp {
  open: boolean,
  handleClose: () => void,
  selectedItem: Schedule | undefined,
  setOpenTaskModal: () => void,
  setSelectedItem: Dispatch<SetStateAction<TaskData>>
}
export function RowModal(props: RowModalProp) {
  if (props.selectedItem === undefined) {
    return (
      <>
      </>
    )
  }
  const item = { ...props.selectedItem } as Schedule;

  const handleClick = () => {
    console.log(item);
    endpointCall(RouterEnum.updateSchedule, item);
    schedulesStore.updateSchedule(item);
  };

  const handleNewTask = () => {
    const newTask: TaskData = {
      id: uuidv4(),
      title: "titre",
      subtitle: "subtitle",
      description: "",
      bgColor: "rgb(31,119,180)",
      startDate: new Date(),
      endDate: new Date(),
      occupancy: 0
    };
    props.setSelectedItem(newTask);
    props.setOpenTaskModal();
    //TODO: if and only if applyied in the task modal, add the new task in the list of tasks of the schedule

  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={props.open}
      onClose={props.handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={props.open}>
        <Box component="form" sx={style}>
          <Typography id="transition-modal-title" variant="h6" component="h2" align="center" >
          Edit the row
          </Typography>
          <FormControl sx={{ width: '100%' }}>

            <TextField
              sx={{ my: 1 }}
              required
              id="outlined-required"
              label="Nom"
              defaultValue={props.selectedItem?.label.title}
              onChange={(e) => {
                item.label.title = e.target.value;
              }}
            />
            <TextField
              sx={{ my: 1 }}
              required
              id="outlined-required"
              label="ID"
              defaultValue={props.selectedItem?.id}
              onChange={(e) => {
                item.id = e.target.value;
              }}
            />
            <TextField
              sx={{ my: 1 }}
              required
              id="outlined-required"
              label="subtitle"
              defaultValue={props.selectedItem?.label.subtitle}
              onChange={(e) => {
                item.label.subtitle = e.target.value;
              }}
            />
            <ButtonGroup variant="contained" aria-label="" sx={{ justifyContent: "end", mt: 2 }}>
              <Button onClick={handleNewTask}>New Task</Button>
              <Button color='error' onClick={() => {props.handleClose();}}>Reset</Button>
              <Button color='success' onClick={handleClick}>Apply</Button>
            </ButtonGroup>
          </FormControl>
        </Box>
      </Fade>
    </Modal>
  )
}
