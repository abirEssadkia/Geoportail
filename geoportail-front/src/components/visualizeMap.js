import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Map.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import * as shapefile from 'shapefile';
import 'leaflet-draw';
import * as turf from '@turf/turf';

const VisualizeMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [layers, setLayers] = useState([]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([34.6806, -1.9086], 6);
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
      

      const drawnItems = new L.FeatureGroup();
      mapRef.current.addLayer(drawnItems);

      const drawControl = new L.Control.Draw({
        edit: {
          featureGroup: drawnItems,
        },
        draw: {
          polyline: true,
          polygon: true,
          circle: false,
          marker: false,
          circlemarker: false,
          rectangle: true,
        }, onEachFeature: (feature, layer) => {
          layer.bindPopup(`<strong>${feature.properties.name || 'Layer'}</strong>`);
        },
      });
      mapRef.current.addControl(drawControl);
      mapRef.current.on(L.Draw.Event.CREATED, function (event) {
        const layer = event.layer;
        drawnItems.addLayer(layer);
      
        if (layer instanceof L.Polyline) {
          const latlngs = layer.getLatLngs();
      
          // Vérifiez si latlngs est un tableau multidimensionnel
          const flatLatlngs = Array.isArray(latlngs[0]) ? latlngs[0] : latlngs;
      
          // Ensure there are enough points to create a valid line
          if (flatLatlngs.length < 2) {
            alert("A line requires at least two points.");
            return;
          }
          mapRef.current.locate({ setView: true, maxZoom: 16 });


          const line = turf.lineString(flatLatlngs.map(ll => [ll.lng, ll.lat]));
          const length = turf.length(line, { units: 'kilometers' });
          alert(`Distance mesurée: ${length.toFixed(2)} km`);
        } else if (layer instanceof L.Polygon) {
          const latlngs = layer.getLatLngs();
      
          // Vérifiez si latlngs est un tableau multidimensionnel
          const flatLatlngs = Array.isArray(latlngs[0]) ? latlngs[0] : latlngs;
      
          // Ensure there are enough points to create a valid polygon
          if (flatLatlngs.length < 3) {
            alert("A polygon requires at least three points.");
            return;
          }
      
          // Process polygon logic here
        }
      });
      
  
      const fetchPublishedLayers = async () => {
        try {
          const response = await fetch('http://localhost:5000/public-layers');
          if (response.ok) {
            const publishedLayers = await response.json();
            publishedLayers.forEach(layerData => {
              const geojsonLayer = L.geoJSON(layerData.geojson, {
                style: {
                  color: '#ff0000',
                  weight: 2,
                  opacity: 1,
                  fillColor: '#ffcccc',
                  fillOpacity: 0.5
                }
              });
              geojsonLayer.addTo(mapRef.current);
              setLayers(prevLayers => [
                ...prevLayers,
                { id: layerData.id, name: layerData.name, geojson: layerData.geojson, layer: geojsonLayer }
              ]);
            });
          }
        } catch (error) {
          console.error('Error fetching published layers:', error);
        }
      };
  
      fetchPublishedLayers();
    }
  }, []);
  
  const handleShapefileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async function (e) {
        const arrayBuffer = e.target.result;
        try {
          const source = await shapefile.open(arrayBuffer);
          const geojson = [];
          let result;
          while (!(result = await source.read()).done) {
            geojson.push(result.value);
          }

          const geojsonLayer = L.geoJSON(geojson, {
            style: {
              color: '#ff0000',
              weight: 2,
              opacity: 1,
              fillColor: '#ffcccc',
              fillOpacity: 0.5
            }
          });

          geojsonLayer.addTo(mapRef.current);

          const newLayer = { id: Date.now(), name: file.name, geojson: geojson, layer: geojsonLayer };
          setLayers(prevLayers => [
            ...prevLayers,
            newLayer
          ]);
        } catch (error) {
          console.error('Error reading shapefile:', error);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleZoomToLayer = (layerId) => {
    const layer = layers.find(l => l.id === layerId);
    if (mapRef.current && layer) {
      mapRef.current.fitBounds(layer.layer.getBounds());
    }
  };

  const handleDeleteLayer = (layerId) => {
    setLayers(prevLayers => {
      const layerToRemove = prevLayers.find(layer => layer.id === layerId);
      if (layerToRemove) {
        mapRef.current.removeLayer(layerToRemove.layer);
      }
      return prevLayers.filter(layer => layer.id !== layerId);
    });
  };



  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="map-container">
      <div id="map"></div>
      <br />
      <div className="file-input-container">
        Choisir un fichier
        <input type="file" accept=".shp" onChange={handleShapefileUpload} />
      </div>
      <h3>Layers</h3>
      <table>
        <thead>
          <tr>
            <th>Layer Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {layers.map((layer) => (
            <tr key={layer.id}>
              <td>{layer.name}</td>
              <td className="button-group">
                <button onClick={() => handleZoomToLayer(layer.id)} className="zoom-layer-button">
                  Zoom to layer
                </button>
                <button onClick={() => handleDeleteLayer(layer.id)} className="delete-layer-button">
                  Delete layer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleBackToHome} id="backToHomeButton">Back to Home</button>
    </div>
  );
};

export default VisualizeMap;
