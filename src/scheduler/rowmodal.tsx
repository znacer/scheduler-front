// import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { Button, ButtonGroup, FormControl, TextField } from "@mui/material";
import { Schedule } from './types';
import schedulesStore from '../stores/schedules.store';
import selectedItemStore from '../stores/selectedItem.store';
import { observer } from 'mobx-react';
import schedulesListStore from '../stores/scheduleslist.store';

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
  selectedRow: Schedule | undefined,
  setOpenTaskModal: () => void,
}
export const RowModal = observer((props: RowModalProp) => {
  if (props.selectedRow === undefined) {
    return (
      <>
      </>
    )
  }
  const item = { ...props.selectedRow };

  const handleApply = () => {
    schedulesStore.updateSchedule(item);
    props.handleClose();
  };

  const handleNewTask = () => {
    selectedItemStore.newItem();
    props.setOpenTaskModal();
    //TODO: if and only if applyied in the task modal, add the new task in the list of tasks of the schedule

  };

  const handleDelete = () => {
    if (props.selectedRow !== undefined) {
      schedulesStore.removeSchedule(props.selectedRow.id);
    }
    props.handleClose();
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={props.open}
      onClose={props.handleClose}
      closeAfterTransition
      // slots={{ backdrop: Backdrop }}
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
              defaultValue={props.selectedRow?.label.title}
              onChange={(e) => {
                item.label.title = e.target.value;
              }}
            />
            <TextField
              sx={{ my: 1 }}
              required
              id="outlined-required"
              label="ID"
              defaultValue={props.selectedRow?.id}
              onChange={(e) => {
                item.id = e.target.value;
              }}
            />
            <TextField
              sx={{ my: 1 }}
              required
              id="outlined-required"
              label="subtitle"
              defaultValue={props.selectedRow?.label.subtitle}
              onChange={(e) => {
                item.label.subtitle = e.target.value;
              }}
            />
            <ButtonGroup aria-label="" variant="contained" orientation="vertical" sx={{ mt: 2 }}>
              <Button color='success' onClick={handleApply}>Appliquer</Button>
              <Button color='primary' onClick={handleNewTask}>Nouvelle tâche</Button>
              <Button color='error' onClick={handleDelete}>Supprimer</Button>
            </ButtonGroup>
          </FormControl>
        </Box>
      </Fade>
    </Modal>
  )
});
