import { ThemeProvider } from '@emotion/react'
import './App.css'
import { SchedulerComponent } from './scheduler/scheduler'
import { createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import 'moment/locale/fr';
import { observer } from 'mobx-react';
import configStore from './stores/config.store';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const App = observer(() => {
  configStore.load();

  if (configStore.backendUrl == "") {
    return (
      <>
      </>
    )
  } else {
    return (
      <>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale='fr'>
            <SchedulerComponent />
          </LocalizationProvider>
        </ThemeProvider>
      </>
    )
  }
})

export default App
