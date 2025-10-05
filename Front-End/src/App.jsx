// src/App.jsx
import React, { useState } from 'react';
import { MapComponent } from './components/Map'; // Asegúrate que la ruta sea correcta
import { findBestSentinel2Image } from './components/PlanetaryComputerAPI';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import './App.css';

function App() {
    const [cogUrl, setCogUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePolygonCreated = async (coords) => {
        setIsLoading(true);
        setError(null);
        setCogUrl(null);

        try {
            const imageUrl = await findBestSentinel2Image(coords);
            if (imageUrl) {
                setCogUrl(imageUrl);
            } else {
                setError("No se encontraron imágenes para el área seleccionada.");
            }
        } catch (err) {
            setError("Ocurrió un error al procesar la solicitud.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="App">
            <header className="app-header">
                <h1>Visor de Imágenes Satelitales (Planetary Computer)</h1>
            </header>

            <div className="status-bar">
                {isLoading && <p>Buscando la mejor imagen disponible...</p>}
                {error && <p className="error-message">{error}</p>}
            </div>

            <MapComponent 
                onPolygonCreated={handlePolygonCreated} 
                cogUrl={cogUrl} 
            />
        </div>
    );
}

export default App;



