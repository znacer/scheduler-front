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
import { observer } from 'mobx-react';

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
export const TaskModal = observer((props: TaskModalProp) => {

  const handleApplyClick = () => {
  };
  const handleSaveClick = () => {
    if (props.selectedRow !== undefined) {
      // const idx = schedulesStore.schedules.findIndex(elt => elt.id === props.selectedRow?.id);
      // schedulesStore.schedules[idx].data.push(selectedItemStore.item); TODO: correct this
      schedulesStore.addTask(props.selectedRow?.id, selectedItemStore.item);
      endpointCall(RouterEnum.updateSchedule, schedulesStore.schedules.get(props.selectedRow?.id));
    } else {
      schedulesStore.updateTask(selectedItemStore.item);
      endpointCall(RouterEnum.updateTask, selectedItemStore.item);
    }
    props.handleClose();
  };
  const handleDelete = () => {
    if (selectedItemStore.target_id !== undefined) {
      schedulesStore.removeTask(selectedItemStore.item);
      endpointUpdateAllSchedules(schedulesStore.aslist());
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
                selectedItemStore.setItemTitle(e.target.value)
              }}
            />
            <TextField
              sx={{ my: 1 }}
              id="outlined-required"
              label="ID"
              defaultValue={selectedItemStore.item.id}
            />
            <TextField
              sx={{ my: 1 }}
              required
              id="outlined-required"
              label="subtitle"
              defaultValue={selectedItemStore.item.subtitle}
              onChange={(e) => {
                selectedItemStore.setItemSubtitle(e.target.value);
              }}
            />
            <TextField
              sx={{ my: 1 }}
              required
              id="outlined-required"
              label="description"
              defaultValue={selectedItemStore.item.description}
              onChange={(e) => {
                selectedItemStore.setItemDescription(e.target.value);
              }}
            />

            <TextField
              sx={{ my: 1 }}
              required
              id="outlined-required"
              label="Couleur"
              defaultValue={selectedItemStore.item.bgColor}
              onChange={(e) => {
                selectedItemStore.setItemBgColor(e.target.value);
              }}
            />
            <DateTimePicker
              sx={{ my: 1 }}
              label="Date de début"
              defaultValue={moment(selectedItemStore.item.startDate)}
              onChange={(e) => {
                if (e !== null) {
                  selectedItemStore.setItemStartDate(new Date(e.format()));
                }
              }}
            />

            <DateTimePicker
              sx={{ my: 1 }}
              label="Date de fin"
              defaultValue={moment(selectedItemStore.item.endDate)}
              onChange={(e) => {
                if (e !== null) {
                  selectedItemStore.setItemEndDate(new Date(e.format()));
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
})
