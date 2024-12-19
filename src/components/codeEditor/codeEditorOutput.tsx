import { useState, type MutableRefObject } from 'react';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { editor } from 'monaco-editor';

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

	try {
		// Execute the code
		eval(codeString);
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