import { forwardRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { editor } from 'monaco-editor';

type TCodeEditorProps = {
	initialValue: string;
}

// eslint-disable-next-line react/display-name
const CodeEditor = forwardRef<editor.IStandaloneCodeEditor, TCodeEditorProps>(({
  initialValue,
}: TCodeEditorProps, ref) => {
  const handelEditorMount: OnMount = (editor) => {
    editor.focus();
    if (ref && typeof ref === 'object') {
      ref.current = editor;
    }
  };

  return (
    <div>
      <Editor
        key={initialValue} // TODO: check to avoid flickering
        defaultLanguage="javascript"
        defaultValue={initialValue}
        height="90vh"
        theme="vs-dark"
        onMount={handelEditorMount}
      />
    </div>
  );
});

export default CodeEditor;


