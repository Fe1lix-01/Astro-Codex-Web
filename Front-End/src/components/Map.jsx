import React, { useEffect } from 'react';
import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import parseGeoraster from 'georaster';
import GeoRasterLayer from 'georaster-layer-for-leaflet';

// Componente para renderizar la capa de imagen COG
const CogLayer = ({ url }) => {
    const map = useMap();

    useEffect(() => {
        if (!url) return;
        
        let layer;
        
        const addCogLayer = async () => {
            try {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                const georaster = await parseGeoraster(arrayBuffer);
                
                layer = new GeoRasterLayer({
                    georaster: georaster,
                    opacity: 0.8,
                    resolution: 128
                });
                
                layer.addTo(map);
                map.fitBounds(layer.getBounds());
            } catch (error) {
                console.error("Error al cargar la capa COG:", error);
            }
        };

        addCogLayer();

        return () => {
            if (layer) {
                map.removeLayer(layer);
            }
        };
    }, [url, map]);

    return null;
};

// Componente principal del mapa
export const MapComponent = ({ onPolygonCreated, cogUrl }) => {
    const handleCreated = (e) => {
        const layer = e.layer;
        const latLngs = layer.getLatLngs()[0];
        const coords = latLngs.map(latLng => [latLng.lng, latLng.lat]);
        coords.push(coords[0]);
        onPolygonCreated(coords);
    };

    return (
        <MapContainer center={[23.63, -102.55]} zoom={5}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <FeatureGroup>
                <EditControl
                    position="topright"
                    onCreated={handleCreated}
                    draw={{ polygon: true, marker: false, circle: false, polyline: false, rectangle: false, circlemarker: false }}
                />
            </FeatureGroup>
            
            {cogUrl && <CogLayer url={cogUrl} />}
        </MapContainer>
    );
};