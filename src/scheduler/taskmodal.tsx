import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { Button, ButtonGroup, FormControl, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import moment from 'moment';
import { Schedule } from './types';
import { endpointCall, endpointUpdateAllSchedules, RouterEnum } from './endpoint';
import schedulesStore from '../stores/schedules.store';
import selectedItemStore from '../stores/selectedItem.store';

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

interface TaskModalProp {
  open: boolean,
  handleClose: () => void,
  selectedRow: Schedule | undefined,
}
export function TaskModal(props: TaskModalProp) {

  const handleApplyClick = () => {
  };
  const handleSaveClick = () => {
    if (props.selectedRow !== undefined) {
      const idx = schedulesStore.schedules.findIndex(elt => elt.id === props.selectedRow?.id);
      schedulesStore.schedules[idx].data.push(selectedItemStore.item);
      endpointCall(RouterEnum.updateSchedule, schedulesStore.schedules[idx]);
    } else {
      schedulesStore.updateTask(selectedItemStore.item);
      endpointCall(RouterEnum.updateTask, selectedItemStore.item);
    }
    props.handleClose();
  };
  const handleDelete = () => {
    if (selectedItemStore.target_id !== undefined) {
      schedulesStore.removeTask(selectedItemStore.target_id);
      endpointUpdateAllSchedules(schedulesStore.schedules);
    }
    props.handleClose();
  }

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
            Details on the tile
          </Typography>
          <FormControl sx={{ width: '100%' }}>

            <TextField
              sx={{ my: 1 }}
              required
              id="outlined-required"
              label="Nom"
              defaultValue={selectedItemStore.item.title}
              onChange={(e) => {
                selectedItemStore.item.title = e.target.value;
              }}
            />
            <TextField
              sx={{ my: 1 }}
              required
              id="outlined-required"
              label="ID"
              defaultValue={selectedItemStore.item.id}
              onChange={(e) => {
                selectedItemStore.item.id = e.target.value;
              }}
            />
            <TextField
              sx={{ my: 1 }}
              required
              id="outlined-required"
              label="subtitle"
              defaultValue={selectedItemStore.item.subtitle}
              onChange={(e) => {
                selectedItemStore.item.subtitle = e.target.value;
              }}
            />
            <TextField
              sx={{ my: 1 }}
              required
              id="outlined-required"
              label="description"
              defaultValue={selectedItemStore.item.description}
              onChange={(e) => {
                selectedItemStore.item.description = e.target.value;
              }}
            />

            <TextField
              sx={{ my: 1 }}
              required
              id="outlined-required"
              label="Couleur"
              defaultValue={selectedItemStore.item.bgColor}
              onChange={(e) => {
                selectedItemStore.item.bgColor = e.target.value;
              }}
            />
            <DateTimePicker
              sx={{ my: 1 }}
              label="Date de début"
              defaultValue={moment(selectedItemStore.item.startDate)}
              onChange={(e) => {
                if (e !== null) {
                  selectedItemStore.item.startDate = new Date(e.format());
                }
              }}
            />

            <DateTimePicker
              sx={{ my: 1 }}
              label="Date de fin"
              defaultValue={moment(selectedItemStore.item.endDate)}
              onChange={(e) => {
                if (e !== null) {
                  selectedItemStore.item.endDate = new Date(e.format());
                }
              }}
            />
            <ButtonGroup variant="contained" aria-label="" sx={{ justifyContent: "end", mt: 2 }}>
              <Button color='error' onClick={handleDelete}>Delete</Button>
              <Button onClick={handleApplyClick}>Apply</Button>
              <Button onClick={handleSaveClick}>Save</Button>
            </ButtonGroup>
          </FormControl>
        </Box>
      </Fade>
    </Modal>
  )
}
