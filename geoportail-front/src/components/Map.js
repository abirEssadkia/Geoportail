import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Map.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import * as shapefile from 'shapefile';
import 'leaflet-draw';
import * as turf from '@turf/turf';
import { v4 as uuidv4 } from 'uuid';


const Map = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [layers, setLayers] = useState([]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([34.6806, -1.9086], 6);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
      mapRef.current.locate({ setView: true, maxZoom: 16 });
    
      mapRef.current.on('locationfound', (e) => {
        const radius = e.accuracy;
        L.circleMarker(e.latlng, {
          color: 'blue',
          radius: 8
        }).addTo(mapRef.current)
          .bindPopup(`You are within ${radius.toFixed(2)} meters from this point`).openPopup();
  
        L.circle(e.latlng, radius).addTo(mapRef.current);
      });
  
      mapRef.current.on('locationerror', () => {
        alert("Location access denied.");
      });
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

          if (mapRef.current) {
            geojsonLayer.addTo(mapRef.current);
          }

          setLayers(prevLayers => [
            ...prevLayers,
            { id: uuidv4(), name: file.name, geojson: geojson, layer: geojsonLayer } // Use UUID for unique id
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

  const handleDeleteLayer = async (layerId) => {
    const storedUser = localStorage.getItem('user');
    
    if (!storedUser) {
      alert("Veuillez vous connecter pour supprimer la couche.");
      navigate('/login');
      return;
    }
  
    const user = JSON.parse(storedUser);
    const layerToDelete = layers.find(layer => layer.id === layerId);
  
    if (!layerToDelete) {
      alert('Layer not found.');
      return;
    }
  
    try {
      // Make a DELETE request to the backend to delete the layer associated with the user
      const response = await fetch(`http://localhost:5000/layers/${layerId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user.id }) // Send userId to verify ownership
      });
  
      if (response.ok) {
        // Remove the layer from the frontend map and state
        setLayers(prevLayers => {
          if (mapRef.current && layerToDelete.layer) {
            mapRef.current.removeLayer(layerToDelete.layer);
          }
          return prevLayers.filter(layer => layer.id !== layerId);
        });
        alert('Layer deleted successfully!');
      } else {
        const error = await response.json();
        console.error('Failed to delete the layer:', error);
        alert('Failed to delete the layer.');
      }
    } catch (err) {
      console.error('Error deleting layer:', err);
      alert('An error occurred while deleting the layer.');
    }
  };
  
  const handleSaveLayer = async (layerId) => {
    const layerToSave = layers.find(layer => layer.id === layerId);
    const storedUser = localStorage.getItem('user');
  
    if (!storedUser) {
      alert("Veuillez vous connecter pour enregistrer la couche.");
      navigate('/login');
      return;
    }
  
    const user = JSON.parse(storedUser);
  
    if (layerToSave) {
      const geojson = layerToSave.layer.toGeoJSON();
  
      const data = {
        name: layerToSave.name,
        geojson: geojson,
        userId: user.id // Save for this user
      };
  
      try {
        const response = await fetch('http://localhost:5000/layers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
  
        if (response.ok) {
          const savedLayer = await response.json();
          alert('Layer saved successfully!');
          // Mark the layer as saved in state
          setLayers(prevLayers =>
            prevLayers.map(layer =>
              layer.id === layerId ? { ...layer, saved: true } : layer
            )
          );
        } else {
          alert('Failed to save the layer.');
        }
      } catch (err) {
        console.error('Error saving layer:', err);
        alert('Error occurred while saving the layer.');
      }
    }
  };
  const fetchUserLayers = async () => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
  
    const user = JSON.parse(storedUser);
    try {
      const response = await fetch(`http://localhost:5000/layers?userId=${user.id}`);
      if (response.ok) {
        const userLayers = await response.json();
        setLayers(userLayers.map(layer => ({
          id: layer.id,
          name: layer.name,
          geojson: layer.geojson,
          layer: L.geoJSON(layer.geojson).addTo(mapRef.current)
        })));
      }
    } catch (error) {
      console.error('Error fetching user layers:', error);
    }
  };
  
  useEffect(() => {
    fetchUserLayers();
  }, []);
  const handlePublishLayer = async (layerId) => {
    const layerToPublish = layers.find(layer => layer.id === layerId);
    const storedUser = localStorage.getItem('user');
  
    if (!storedUser) {
      alert("Veuillez vous connecter pour publier la couche.");
      navigate('/login');
      return;
    }
  
    const user = JSON.parse(storedUser);
  
    if (layerToPublish) {
      try {
        const response = await fetch('http://localhost:5000/publish', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: layerToPublish.name,
            geojson: layerToPublish.geojson,
            userId: user.id
          })
        });
  
        if (response.ok) {
          alert('Layer published successfully!');
        } else {
          const error = await response.json();
          alert('Failed to publish the layer: ' + error.error);
        }
      } catch (error) {
        console.error('Error publishing layer:', error);
        alert('An error occurred while publishing the layer.');
      }
    }
  };
  
  
  useEffect(() => {
    // Initialize the map if not already done
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
        },
      });
      mapRef.current.addControl(drawControl);
      mapRef.current.on(L.Draw.Event.CREATED, function (event) {
        const layer = event.layer;
        drawnItems.addLayer(layer);
      
        // Add logic for drawing shapes here
      });
  
   
    }
  }, []);
  
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
                <button onClick={() => handleSaveLayer(layer.id)} className="save-layer-button">
                  Save to Database
                </button>
                <button onClick={() => handlePublishLayer(layer.id)} className="publish-layer-button">
                  Publish Data
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

export default Map;
