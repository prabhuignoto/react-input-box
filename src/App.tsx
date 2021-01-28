import React from 'react';
import './App.css';
import { EditTextComponent } from './components/EditText';

interface AppProps {}

function App({}: AppProps) {
  return (
    <div className="App">
      <EditTextComponent
        mode="INPUT"
        value=""
        placeholder="Enter a value..."
        isPasswordField
      />
    </div>
  );
}

export default App;
