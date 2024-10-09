import { Avatar, Box, Button, ButtonGroup, Checkbox, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { endpointCall, RouterEnum } from "./endpoint";
import { Schedule, ScheduleList } from "./types";
import schedulesStore from "../stores/schedules.store";
import { useEffect, useState } from "react";
import { Checklist } from "@mui/icons-material";

interface ScheduleDrawerProp {
  open: boolean,
  handleClose: () => void,
  handleOpenNewPlan: () => void,
};
export function ScheduleDrawer(props: ScheduleDrawerProp) {
  const [scheduleList, setScheduleList] = useState<ScheduleList[]>([]);
  useEffect(() => {
    endpointCall(RouterEnum.listSchedules, {}).then((data) => {
      setScheduleList(data as ScheduleList[]);
    })
  }, [])

  const [checked, setChecked] = useState<number[]>([]);
  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  useEffect(() => {
    // fetch data
    schedulesStore.reset()
    checked.forEach((idx: number) => {
      endpointCall(RouterEnum.fetchSchedule, { "id": scheduleList[idx].id }).then((data) => {
        schedulesStore.addSchedule(data as Schedule);
      })
    })
  }, [checked, scheduleList]);

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
                  setChecked(scheduleList.map((_, idx: number) => idx));
                }} />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider />
          <List>
            {
              scheduleList.map((schedule: ScheduleList, idx: number) => {
                return (
                  <ListItem
                    key={schedule.id}
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        onChange={handleToggle(idx)}
                        checked={checked.includes(idx)}
                        inputProps={{ 'aria-labelledby': schedule.id }}
                      />
                    }
                  >
                    <ListItemButton>
                      <ListItemIcon>
                        <Avatar src={schedule.icon} />
                      </ListItemIcon>
                      <ListItemText id={schedule.id} primary={schedule.title} onClick={handleToggle(idx)} />
                    </ListItemButton>
                  </ListItem>
                )
              })
            }
          </List>
        </Box>
        <ButtonGroup variant="outlined" aria-label="" sx={{ justifyContent: "center" }}>
          <Button variant="contained" onClick={props.handleOpenNewPlan}>
            Nouvelle plannification
          </Button>
        </ButtonGroup>
      </Box>
    </Drawer>

  );

}
