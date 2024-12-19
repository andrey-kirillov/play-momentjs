import { useState, SyntheticEvent, useRef } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import CodeEditor from './components/codeEditor/codeEditor';
import CodeEditorOutput from './components/codeEditor/codeEditorOutput';
import globalMoment from 'moment';
import globalMomentTz from 'moment-timezone';
declare global {
  interface Window {
    globalMoment: typeof globalMoment;
    globalMomentTz: typeof globalMomentTz;
  }
}

const now = `
// const browsertimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// const timezonefromMoment = globalMomentTz.tz.guess();
// const utcOffset = globalMoment().format('Z');

const dateNow = new Date();
const emptyMoment = globalMoment();
const momentWithDateNow = globalMoment(dateNow);
const momentWithDateNowTimezone = globalMomentTz(dateNow);
const momentTimezoneNow = globalMomentTz.tz();

console.log({
  dateNow,
  emptyMoment,
  momentWithDateNow,
  momentWithDateNowTimezone,
  momentTimezoneNow,
})

console.log({
  dateNow: dateNow.toISOString(),
  emptyMoment: emptyMoment.format(),
  momentWithDateNow: momentWithDateNow.format(),
  momentWithDateNowTimezone: momentWithDateNowTimezone.format(),
  momentTimezoneNow: momentTimezoneNow.format(),
})
`;

window.globalMoment = globalMoment;
window.globalMomentTz = globalMomentTz;

const convert = `console.log(1)`;

const timestamp = `console.log(2)`;

const editorScenarios = {
  now,
  convert,
  timestamp,
};

type TTabsValue = keyof typeof editorScenarios;

function App() {
  const [tabsValue, setTabsValue] = useState<TTabsValue>('now');
  const handleChange = (_event: SyntheticEvent, newValue: TTabsValue) => {
    setTabsValue(newValue);
  };

  const editorRef = useRef(null);

  const browsertimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timezonefromMoment = globalMomentTz.tz.guess();
  const utcOffset = globalMoment().format('Z');
  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography>You can use directly: <b>globalMoment</b>, <b>globalMomentTz</b></Typography>
        <Box>
          <Typography>My timezone from momentTimezone.tz.guess(): <b>{timezonefromMoment}</b></Typography>
          <Typography>My timezone from Intl.DateTimeFormat().resolvedOptions().timeZone: <b>{browsertimeZone}</b></Typography>
          <Typography>My utcOffset: <b>{utcOffset}</b></Typography>
        </Box>
      </Box>
      <Box mb={2} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs onChange={handleChange} variant="fullWidth" value={tabsValue} >
          <Tab label="now" value="now" />
          <Tab label="convert" value="convert" />
          <Tab label="timestamp" value="timestamp" />
        </Tabs>
      </Box>
      <Box display="flex">
        <Box width="50%">
          <CodeEditor ref={editorRef} initialValue={editorScenarios[tabsValue]} />
        </Box>
        <Box width="50%">
          <CodeEditorOutput editorRef={editorRef} />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
