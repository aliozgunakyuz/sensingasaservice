import React, { useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';  // Import Python language support

function CodeBlock({ onCodeInputChange, codeValue }) {
  const [value, setValue] = React.useState(codeValue || "# Write your Python code here\nprint('Hello, world!')");  // Default Python code

  useEffect(() => {
    if (codeValue !== value) {
      setValue(codeValue);
    }
  }, [codeValue]);

  const onChange = React.useCallback((val, viewUpdate) => {
    console.log('val:', val);
    setValue(val);
    // Pass the updated value to the parent component
    onCodeInputChange(val);
  }, [onCodeInputChange]);

  return (
    <CodeMirror
      value={value}
      height="200px"
      extensions={[python()]}  // Use Python syntax highlighting
      onChange={onChange}
    />
  );
}

export default CodeBlock;
