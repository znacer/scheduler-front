import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { Button, ButtonGroup, FormControl, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import moment from 'moment';
import { TaskData } from './types';

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
  selectedItem: TaskData
}
export function TaskModal(props: TaskModalProp) {

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
              defaultValue={props.selectedItem?.title}
            />
            <TextField
              sx={{ my: 1 }}
              required
              id="outlined-required"
              label="ID"
              defaultValue={props.selectedItem?.id}
            />
            <TextField
              sx={{ my: 1 }}
              required
              id="outlined-required"
              label="subtitle"
              defaultValue={props.selectedItem?.subtitle}
            />
            <TextField
              sx={{ my: 1 }}
              required
              id="outlined-required"
              label="description"
              defaultValue={props.selectedItem?.description}
            />

            <TextField
              sx={{ my: 1 }}
              required
              id="outlined-required"
              label="Couleur"
              defaultValue={props.selectedItem?.bgColor}
            />
            <DateTimePicker
              sx={{ my: 1 }}
              label="Date de début"
              defaultValue={moment(props.selectedItem?.startDate)}
            />

            <DateTimePicker
              sx={{ my: 1 }}
              label="Date de fin"
              defaultValue={moment(props.selectedItem?.endDate)}
            />
            <ButtonGroup variant="contained" aria-label="" sx={{ justifyContent: "end", mt: 2 }}>
              <Button>Reset</Button>
              <Button>Apply</Button>
            </ButtonGroup>
          </FormControl>
        </Box>
      </Fade>
    </Modal>
  )
}
