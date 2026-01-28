import React from 'react';
import { RefButton } from '@reference-ui/react';
import type { ButtonVariant } from '@reference-ui/react';

/**
 * Example React app demonstrating Reference UI components
 */
function App() {
  const [clickCount, setClickCount] = React.useState(0);
  
  const handleClick = () => {
    setClickCount(prev => prev + 1);
    console.log('Button clicked!');
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui' }}>
      <h1>Reference UI - React Example</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Button Variants</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <RefButton label="Primary Button" variant="primary" />
          <RefButton label="Secondary Button" variant="secondary" />
          <RefButton label="Outline Button" variant="outline" />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Button Sizes</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <RefButton label="Small" variant="primary" size="small" />
          <RefButton label="Medium" variant="primary" size="medium" />
          <RefButton label="Large" variant="primary" size="large" />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Disabled State</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <RefButton label="Disabled Primary" variant="primary" disabled />
          <RefButton label="Disabled Secondary" variant="secondary" disabled />
          <RefButton label="Disabled Outline" variant="outline" disabled />
        </div>
      </div>

      <div>
        <h2>TypeScript Support</h2>
        <p>Clicks: {clickCount}</p>
        <RefButton 
          label={`Click me (${clickCount})`}
          variant="primary" 
          size="large"
          // TypeScript will validate these props!
        />
      </div>
    </div>
  );
}

export default App;
