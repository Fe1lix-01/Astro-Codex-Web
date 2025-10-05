import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const WorldMap = () => {
  const onCreated = (e) => { //e contiene el poligono creado
    const { layer } = e;
    const type = e.layerType; //tipo de forma creada (polygon, polyline, rectangle, etc.)

        // Lógica para manejar las coordenadas según el tipo de forma
        if (type === 'polygon' || type === 'rectangle') {
            // Para polígonos y rectángulos, las coordenadas están anidadas
            const coordinates = layer.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]);
            console.log('Coordenadas del polígono:', coordinates);
  }     
        else if (type === 'polyline') {
        // Para líneas, las coordenadas no están anidadas
        const coordinates = layer.getLatLngs().map(latlng => [latlng.lat, latlng.lng]);
        console.log('Coordenadas de la línea:', coordinates);
  }
  };

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

      <FeatureGroup>
        <EditControl
          position="topright"
          onCreated={onCreated}
          draw={{
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
          }}
        />
      </FeatureGroup>
    </MapContainer>
  );
};

export default WorldMap;