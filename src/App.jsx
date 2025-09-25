import React from 'react';
import WorldMap from './components/WorldMap'
import EarthEngineMap from './components/EarthEngineApi';
import './App.css'


function App2() {
  return (
    <div className="App">
      <h1>Mapa Interactivo Astro-Codex</h1>
      <WorldMap />
    </div>
  );
}


function App() {
  return (
    <div className="App">
      <h1>Mapa de NDVI con Google Earth Engine</h1>
      <EarthEngineMap />
    </div>
  );
}

export default App;



