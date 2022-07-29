import React from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import Leaflet from 'leaflet';
import styles from './Map.module.css';

const DestinationMarkers = ({ locations }) => {
  const map = useMap();

  for (let i = locations.length - 1; i >= 0; i--) {
    const el = locations[i];
    let basePopup = Leaflet.popup({
      autoClose: false,
      closeOnClick: true,
    })
      .setLatLng(el.coordinates)
      .setContent(`<p>Day ${i + 1}: ${el.name}</p>`)
      .openOn(map);

    Leaflet.marker(el.coordinates).bindPopup(basePopup).addTo(map);
  }

  map.fitBounds(
    locations.map((el) => el.coordinates),
    { padding: [50, 50] }
  );
};

const Map = ({ locations }) => {
  const locationsArr = locations.map((el) => {
    const lat = el.coordinates[1];
    const lng = el.coordinates[0];
    return { ...el, coordinates: [lat, lng] };
  });

  return (
    <div className={styles['map-container']}>
      {
        <MapContainer
          center={locationsArr[0].coordinates}
          zoom={9}
          scrollWheelZoom={false}
        >
          {/* DEFAULT TILE LAYER */}
          {/* <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          /> */}

          <TileLayer
            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
            url='https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
            maxZoom={20}
          />

          <DestinationMarkers locations={locationsArr} />
        </MapContainer>
      }
    </div>
  );
};

export default Map;
