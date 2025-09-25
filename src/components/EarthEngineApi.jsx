import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import * as ee from '@google/earthengine';
import L from 'leaflet';

const GOOGLE_CLOUD_PROJECT_ID = '326160156691-um6cvlgrq17ol1i7es2cso4091q9bm1n.apps.googleusercontent.com'; 

const MapControls = () => {
  const [eeLayer, setEeLayer] = useState(null);
  const map = useMap(); // Aquí ya está dentro del contexto de <MapContainer>

  useEffect(() => {
    ee.data.authenticateViaOauth(
      '326160156691-um6cvlgrq17ol1i7es2cso4091q9bm1n.apps.googleusercontent.com', 
      () => { console.log('Autenticación exitosa!'); },
      (error) => { console.error('Error de autenticación:', error); }
    );
  }, []);

const onCreated = async (e) => {
  const { layer } = e;
  const type = e.layerType;

  if (type === 'polygon' || type === 'rectangle') {
    const coordinates = layer.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]);
    console.log('Coordenadas del polígono:', coordinates);

    const eePolygon = ee.Geometry.Polygon(coordinates);
    const imageCollection = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
                               .filterDate('2023-01-01', '2024-03-31')
                               .filterBounds(eePolygon);

    // Cuenta el número de imágenes en la colección
    const count = await imageCollection.size().getInfo();
    
    // Verifica si la colección no está vacía
    if (count > 0) {
      const image = imageCollection.median().multiply(0.0001);
      const nir = image.select('B5');
      const red = image.select('B4');
      const ndvi = nir.subtract(red).divide(nir.add(red)).rename('NDVI');
      const ndviVis = { min: -1, max: 1, palette: ['red', 'yellow', 'green'] };
      
      const token = await ndvi.getMap(ndviVis);
      
      const newLayer = L.tileLayer(token.url, {
        maxNativeZoom: token.maxZoom,
        minNativeZoom: token.minZoom,
      });

      if (eeLayer) {
        map.removeLayer(eeLayer);
      }
      
      map.addLayer(newLayer);
      setEeLayer(newLayer);
    } else {
      console.log('No se encontraron imágenes para el polígono y el rango de fechas especificado.');
      alert('No se encontraron imágenes para esta área y rango de fechas. Por favor, intente con otra área o rango.');
    }
  }
};

  return (
    <FeatureGroup>
      <EditControl
        position="topright"
        onCreated={onCreated}
        draw={{
          rectangle: true,
          circle: false,
          circlemarker: false,
          marker: false,
        }}
      />
    </FeatureGroup>
  );
};

// El componente principal, que solo se encarga de renderizar <MapContainer>
const EarthEngineMap = () => {
  return (
    <MapContainer 
      center={[20, 0]} 
      zoom={2} 
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapControls />
    </MapContainer>
  );
};

export default EarthEngineMap;