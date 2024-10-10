import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { Button, ButtonGroup, FormControl, TextField } from "@mui/material";
import { Schedule } from './types';
import { v4 as uuidv4 } from 'uuid';
import { endpointCall, RouterEnum } from './endpoint';
import schedulesListStore from '../stores/scheduleslist.store';
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

interface NewPlanModalProp {
  open: boolean,
  handleClose: () => void,
}
export const NewPlanModal = observer((props: NewPlanModalProp) => {
  const newSchedule: Schedule = {
    data: [],
    id: uuidv4(),
    label: {
      title: "Nouvelle plannification",
      icon: "",
      subtitle: ""
    }
  }

  const handleSaveClick = () => {
    endpointCall(RouterEnum.newSchedule, newSchedule.label).then(
      () => {
        schedulesListStore.updateList();
      }
    );
    props.handleClose();
  };
  const handleCancel = () => {
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
              label="Titre"
              defaultValue={newSchedule.label.title}
              onChange={
                (e) => {
                  newSchedule.label.title = e.target.value;
                }
              }
            />
            <TextField
              sx={{ my: 1 }}
              required
              id="outlined-required"
              label="Sous-titre"
              defaultValue={newSchedule.label.subtitle}
              onChange={
                (e) => {
                  newSchedule.label.subtitle = e.target.value;
                }
              }
            />
            <TextField
              sx={{ my: 1 }}
              id="outlined-required"
              label="URL icon"
              defaultValue={newSchedule.label.icon}
              onChange={
                (e) => {
                  newSchedule.label.icon = e.target.value;
                }
              }
            />
            <ButtonGroup variant="contained" aria-label="" sx={{ justifyContent: "end", mt: 2 }}>
              <Button color='error' onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSaveClick}>Save</Button>
            </ButtonGroup>
          </FormControl>
        </Box>
      </Fade>
    </Modal>
  )
});
