import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import { endpointCall, RouterEnum } from "./endpoint";
import { Schedule } from "./types";
import { Dispatch, SetStateAction } from "react";

interface ScheduleDrawerProp {
  open: boolean,
  handleClose: () => void,
  setData: Dispatch<SetStateAction<Schedule[]>>
}
export function ScheduleDrawer(props: ScheduleDrawerProp) {
  return (
    <Drawer open={props.open} onClose={props.handleClose} anchor="right">
      <Box sx={{ width: 250 }} role="presentation" onClick={props.handleClose}>
        <List>
          <ListItem key="fetch_all" disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <DownloadIcon />
              </ListItemIcon>
              <ListItemText primary="test" onClick={() => {
                endpointCall(RouterEnum.test).then((data: Schedule[]) => {
                  console.log(1)
                  props.setData(data);
                })
              }} />
            </ListItemButton>
            <ListItemButton>
              <ListItemIcon>
                <DownloadIcon />
              </ListItemIcon>
              <ListItemText primary="fetch_all" onClick={() => {
                endpointCall(RouterEnum.fetchAll).then((data: Schedule[]) => {
                  props.setData(data);
                })
              }} />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
        </List>
      </Box>
    </Drawer>

  );

}
