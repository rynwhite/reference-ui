import React from 'react';
import { RefButton } from '@reference/core/react';

function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Reference UI Test App</h1>
      <p>Testing CLI-generated styles and core components</p>

      <div style={{ marginTop: '2rem' }}>
        <RefButton>Click Me</RefButton>
      </div>
    </div>
  );
}

export default App;
