import { forwardRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { editor } from 'monaco-editor';

// eslint-disable-next-line react/display-name
const CodeEditor = forwardRef<editor.IStandaloneCodeEditor>((props, ref) => {
	const handelEditorMount: OnMount = (editor) => {
		editor.focus();
		if (ref && typeof ref === 'object') {
			ref.current = editor;
		}
	};

	return (
		<div>
			<Editor
				defaultLanguage="javascript"
				defaultValue="console.log('Hello, world!')"
				height="90vh"
				theme="vs-dark"
				onMount={handelEditorMount}
			/>
		</div>
	);
});

export default CodeEditor;


