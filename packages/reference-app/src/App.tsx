import '@reference-ui/core';

function App() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Reference UI Test App</h1>
      <p>Testing CLI-generated styles and core components</p>

      <div style={{ marginTop: '2rem' }}>
        <ref-button>Click Me</ref-button>
      </div>
    </div>
  );
}

export default App;
