import { useState, SyntheticEvent, useRef } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import CodeEditor from './components/codeEditor/codeEditor';
import CodeEditorOutput from './components/codeEditor/codeEditorOutput';
import moment from 'moment';
import momentTz from 'moment-timezone';


const now = `
// const browsertimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// const timezonefromMoment = momentTz.tz.guess();
// const utcOffset = moment().format('Z');

const dateNow = new Date();
const emptyMoment = moment();
const momentWithDateNow = moment(dateNow);
const momentWithDateNowTimezone = momentTz(dateNow);
const momentTimezoneNow = momentTz.tz();

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

const convert = `
const newYork    = moment.tz("2014-06-01 12:00", "America/New_York");
const losAngeles = newYork.clone().tz("America/Los_Angeles");
const london     = newYork.clone().tz("Europe/London");

console.log({
    newYork: newYork.format(),    // 2014-06-01T12:00:00-04:00
    losAngeles: losAngeles.format(), // 2014-06-01T09:00:00-07:00
    london: london.format(),     // 2014-06-01T17:00:00+01:00
})

console.log({
  a0: moment.tz("2014-06-01", "America/New_York").format(),
  b0: moment().tz("2014-06-01", "America/Los_Angeles").format(),
  a1: momentTz.tz("2014-06-01", "America/New_York").format(),
  b1: momentTz().tz("2014-06-01", "America/Los_Angeles").format(),
})

console.log({
  a0: moment.tz("2014-06-01", "America/New_York").utc().format(),
  b0: moment().tz("2014-06-01", "America/Los_Angeles").utc().format(),
  a1: momentTz.tz("2014-06-01", "America/New_York").utc().format(),
  b1: momentTz().tz("2014-06-01", "America/Los_Angeles").utc().format(),
})
`;

const timestamp = `
console.log({
    a0: moment().toDate().getTime(),
    b0: moment().tz('America/New_York').toDate().getTime(),
    c0: moment().tz('Europe/London').toDate().getTime(),
    d0: moment().tz('Asia/Tokyo').toDate().getTime(),
    a1: momentTz().toDate().getTime(),
    b1: momentTz().tz('America/New_York').toDate().getTime(),
    c1: momentTz().tz('Europe/London').toDate().getTime(),
    d1: momentTz().tz('Asia/Tokyo').toDate().getTime(),
})
`;

const toMomentTimezoneSync = `
// you can use: toMomentTimezoneSync, setContextTimezone

// setContextTimezone('Africa/Johannesburg');
// setContextTimezone('America/New_York');
// setContextTimezone('Europe/London');
setContextTimezone('Asia/Tokyo');

console.log({
  a: toMomentTimezoneSync().format(),
  b: toMomentTimezoneSync(toMomentTimezoneSync(), false, 'America/New_York').format(),
  c: toMomentTimezoneSync(toMomentTimezoneSync(), true, 'America/New_York').format(),
  d: toMomentTimezoneSync(toMomentTimezoneSync(), false, true).format(),
})
`;

const editorScenarios = {
  now,
  convert,
  timestamp,
  toMomentTimezoneSync,
};

type TTabsValue = keyof typeof editorScenarios;

function App() {
  const [tabsValue, setTabsValue] = useState<TTabsValue>('now');
  const handleChange = (_event: SyntheticEvent, newValue: TTabsValue) => {
    setTabsValue(newValue);
  };

  const editorRef = useRef(null);

  const browsertimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timezonefromMoment = momentTz.tz.guess();
  const utcOffset = moment().format('Z');
  return (
    <Box>
      <Typography>Remember: <b>Moment object is mutable. Always use .clone() before modifying.</b></Typography>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography>You can use directly (inside the code editor): <b>moment</b>, <b>momentTz</b></Typography>
        <Box>
          <Typography>My timezone from momentTz.tz.guess(): <b>{timezonefromMoment}</b></Typography>
          <Typography>My timezone from Intl.DateTimeFormat().resolvedOptions().timeZone: <b>{browsertimeZone}</b></Typography>
          <Typography>My utcOffset: <b>{utcOffset}</b></Typography>
        </Box>
      </Box>
      <Box mb={2} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs onChange={handleChange} variant="fullWidth" value={tabsValue} >
          {Object.keys(editorScenarios).map((key) => (
            <Tab key={key} label={key} value={key} />
          ))}
        </Tabs>
      </Box>
      <Box display="flex" key={editorScenarios[tabsValue]} >
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
