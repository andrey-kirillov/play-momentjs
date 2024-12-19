import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

const API = axios.create({
	baseURL: 'https://emkc.org/api/v2/piston',
});

const executeCode = async (editorContent: string) => {
	const response = await API.post('/execute', {
		language: 'javascript',
		version: '18.15.0',
		files: [
			{
				content: editorContent,
			},
		],
	});

	return response.data;
};

const CodeEditorOutput = ({ editorRef }) => {

  const [output, setOutput] = useState('');

	const handleRunCode = async () => {
		const sourceCode = editorRef.current.getValue();
		if (!sourceCode)
			console.error('Run code', sourceCode);

		try {
			const { run: result } = await executeCode(sourceCode);
			setOutput(result.output);
		} catch (error) {
			console.error('Run code', error);
		}
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
				{output}
			</Box>
		</Box>
	);
};

export default CodeEditorOutput;