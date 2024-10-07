import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { Button, ButtonGroup, FormControl, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import moment from 'moment';
import { TaskData } from './types';
import { endpointCall, RouterEnum } from './endpoint';

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
  selectedItem: TaskData,
  setItem: (item: TaskData) => void
}
export function TaskModal(props: TaskModalProp) {
  if (props.selectedItem === undefined) {
    return (
      <>
      </>
    )
  }
  const item = { ...props.selectedItem } as TaskData;

  const handleClick = () => {
    endpointCall(RouterEnum.updateTask, item);
    props.setItem(item);
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
            Details on the tile
          </Typography>
          <FormControl sx={{ width: '100%' }}>

            <TextField
              sx={{ my: 1 }}
              required
              id="outlined-required"
              label="Nom"
              defaultValue={props.selectedItem?.title}
              onChange={(e) => {
                item.title = e.target.value;
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
              defaultValue={props.selectedItem?.subtitle}
              onChange={(e) => {
                item.subtitle = e.target.value;
              }}
            />
            <TextField
              sx={{ my: 1 }}
              required
              id="outlined-required"
              label="description"
              defaultValue={props.selectedItem?.description}
              onChange={(e) => {
                item.description = e.target.value;
              }}
            />

            <TextField
              sx={{ my: 1 }}
              required
              id="outlined-required"
              label="Couleur"
              defaultValue={props.selectedItem?.bgColor}
              onChange={(e) => {
                item.bgColor = e.target.value;
              }}
            />
            <DateTimePicker
              sx={{ my: 1 }}
              label="Date de début"
              defaultValue={moment(props.selectedItem?.startDate)}
              onChange={(e) => {
                if (e !== null) {
                  item.startDate = new Date(e.format());
                }
              }}
            />

            <DateTimePicker
              sx={{ my: 1 }}
              label="Date de fin"
              defaultValue={moment(props.selectedItem?.endDate)}
              onChange={(e) => {
                if (e !== null) {
                  item.endDate = new Date(e.format());
                }
              }}
            />
            <ButtonGroup variant="contained" aria-label="" sx={{ justifyContent: "end", mt: 2 }}>
              <Button>Reset</Button>
              <Button onClick={handleClick}>Apply</Button>
            </ButtonGroup>
          </FormControl>
        </Box>
      </Fade>
    </Modal>
  )
}
