import { useState, SyntheticEvent, useRef } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CodeEditor from './components/codeEditor/codeEditor';
import CodeEditorOutput from './components/codeEditor/codeEditorOutput';

type TTabsValue = 'home'

function App() {
	const [tabsValue, setTabsValue] = useState<TTabsValue>('home');
	const handleChange = (_event: SyntheticEvent, newValue: TTabsValue) => {
		setTabsValue(newValue);
	};

	const editorRef = useRef(null);

	return (
		<TabContext value={tabsValue}>
			<Box sx={{borderBottom: 1, borderColor: 'divider'}}>
				<TabList onChange={handleChange}>
					<Tab label="Home" value="home" />
				</TabList>
			</Box>
			<TabPanel value="home">
				<Box display="flex">
					<Box width="50%">
						<CodeEditor ref={editorRef}/>
					</Box>
					<Box width="50%">
					 <CodeEditorOutput editorRef={editorRef}/>
					</Box>
				</Box>
			</TabPanel>
		</TabContext>
	);
}

export default App;
