import { useState, type MutableRefObject } from 'react';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { editor } from 'monaco-editor';
import moment from 'moment';
import MomentTimezone, { type Moment, type MomentInput } from 'moment-timezone';

// TODO: 
// add fake my timezone

type TContextTimezone = string | null;
let contextTimezone: TContextTimezone = null;
type TToMomentTimezoneSync = (
  date?: MomentInput,
  dontConvertTime?: boolean | string,
  timeZone?: string | boolean
) => Moment;
const getContextTimezone = () => contextTimezone;
const setContextTimezone = (timezone: TContextTimezone = null) => contextTimezone = timezone;

const toMomentTimezoneSync: TToMomentTimezoneSync = (date, dontConvertTime = false, _timeZone) => {

  const timeZone = !_timeZone
    ? getContextTimezone()
    : _timeZone !== true
      ? _timeZone
      : Intl?.DateTimeFormat().resolvedOptions().timeZone || getContextTimezone();

  let momentTz: MomentTimezone.Moment;
  if (dontConvertTime) {
    if (!date) {
      date = MomentTimezone();

      // We need this to be able to mock current date and timezone
      // if (isJest)
      //   date.tz(MomentTimezone.tz.guess());
    }

    momentTz = MomentTimezone.tz(
      (typeof date === 'string' ? MomentTimezone.parseZone(date) : date as Moment).format('YYYY-MM-DDTHH:mm:ss'),
      timeZone as string,
    );

    if (typeof dontConvertTime === 'string') {
      const [hours, minutes, seconds] = dontConvertTime.split(':');
      momentTz.set({
        hours: Number(hours),
        minutes: Number(minutes),
        seconds: Number(seconds),
      });
    }
  }
  else
    momentTz = MomentTimezone.tz(date, timeZone as string);
  return momentTz;
};

// make moment and momentTz available in the global scope
// so eval can use them
declare global {
  interface Window {
    __globalMoment: typeof moment;
    __globalMomentTz: typeof MomentTimezone;
    __toMomentTimezoneSync: typeof toMomentTimezoneSync;
    __setContextTimezone: typeof setContextTimezone;
  }
}

window.__globalMoment = moment;
window.__globalMomentTz = MomentTimezone;
window.__toMomentTimezoneSync = toMomentTimezoneSync;
window.__setContextTimezone = setContextTimezone;

const executeCode = (codeString: string) => {
  // Store original console.log
  const originalLog = console.log;
  const logs: unknown[] = [];

  // Override console.log
  console.log = (...args) => {
    logs.push(args);
    logs.push('\n----------------------------------\n');
    originalLog.apply(console, args);
  };

  // Wrap the code in an IIFE to provide proper scope
  const wrappedCode = `
   (() => {
      const moment = window.__globalMoment;
      const momentTz = window.__globalMomentTz;
      const toMomentTimezoneSync = window.__toMomentTimezoneSync;
      const setContextTimezone = window.__setContextTimezone;
     ${codeString}
   })();
 `;

  try {
    // Execute the code
    eval(wrappedCode);
  } catch (error) {
    alert(error);
    console.error(error);
  } finally {
    // Restore original console.log
    console.log = originalLog;
  }

  return logs;
};

type TCodeEditorOutputProps = {
  editorRef: MutableRefObject<editor.IStandaloneCodeEditor | null>;
}

const CodeEditorOutput = ({
  editorRef
}: TCodeEditorOutputProps) => {
  const [output, setOutput] = useState<unknown[]>([]);

  const handleRunCode = async () => {
    const sourceCode = editorRef?.current?.getValue();
    if (!sourceCode) {
      console.warn('No code to run', sourceCode);
      return;
    }

    const logs = executeCode(sourceCode);
    setOutput(logs);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Button
        variant="contained"
        color="primary"
        onClick={handleRunCode}
      >
        Run
      </Button>
      <Box flexGrow={1} border="1px solid grey" height="100%">
        <pre>
          {output.map((log) => {
            if (typeof log === 'string')
              return log;
            return JSON.stringify(log, null, 2);
          })}
        </pre>
      </Box>
    </Box>
  );
};

export default CodeEditorOutput;