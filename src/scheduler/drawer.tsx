import { Avatar, Box, Button, ButtonGroup, Checkbox, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { endpointCall, RouterEnum } from "./endpoint";
import { Schedule, ScheduleList } from "./types";
import schedulesStore from "../stores/schedules.store";
import { Checklist } from "@mui/icons-material";
import schedulesListStore from "../stores/scheduleslist.store";
import { observer } from "mobx-react";
import checkDrawer from "../stores/checkedDrawer.store";

interface ScheduleDrawerProp {
  open: boolean,
  handleClose: () => void,
  handleOpenNewPlan: () => void,
};
export const ScheduleDrawer = observer((props: ScheduleDrawerProp) => {

  const reloadSchedules = () => {
    schedulesStore.reset()
    checkDrawer.list.forEach((schedule_id: string) => {
      endpointCall(RouterEnum.fetchSchedule, { "id": schedule_id }).then((data) => {
        schedulesStore.addSchedule(data as Schedule);
      })
    });
  }
  const handleToggle = (uid: string) => () => {
    if (checkDrawer.list.has(uid)) {
      checkDrawer.uncheck(uid);
    } else {
      checkDrawer.check(uid);
    }
    reloadSchedules();
  };

  return (
    <Drawer
      open={props.open}
      onClose={props.handleClose}
      anchor="right"
      sx={{
        height: "100%",
      }}>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          pb: 2
        }}
      >
        <Box sx={{ width: 330 }} role="presentation" onClick={() => { }}>
          <List>
            <ListItem>
              <ListItemButton>
                <ListItemIcon>
                  <Checklist />
                </ListItemIcon>
                <ListItemText primary="Tout selectionner" onClick={() => {
                  schedulesListStore.list.forEach((schedule: ScheduleList) => {
                    checkDrawer.check(schedule.id);
                  });
                  reloadSchedules();

                }} />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider />
          <List>
            {
              Array.from(schedulesListStore.keys()).map((schedule_id: string) => {
                return (
                  <ListItem
                    key={schedule_id}
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        onChange={handleToggle(schedule_id)}
                        checked={checkDrawer.list.has(schedule_id)}
                        inputProps={{ 'aria-labelledby': schedule_id }}
                      />
                    }
                  >
                    <ListItemButton>
                      <ListItemIcon>
                        <Avatar src={schedulesListStore.list.get(schedule_id)?.icon} />
                      </ListItemIcon>
                      <ListItemText
                        id={schedule_id}
                        primary={schedulesListStore.list.get(schedule_id)?.title}
                        onClick={handleToggle(schedule_id)}
                      />
                    </ListItemButton>
                  </ListItem>
                )
              })
            }
          </List>
        </Box>
        <ButtonGroup variant="outlined" aria-label="" sx={{ justifyContent: "center" }}>
          <Button variant="contained" onClick={props.handleOpenNewPlan}>
            <Typography variant="button">
              Nouvelle plannification
            </Typography>
          </Button>
        </ButtonGroup>
      </Box>
    </Drawer>

  );

})
