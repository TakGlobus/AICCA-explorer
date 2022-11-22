/**
 * GIBS Web Examples
 *
 * Copyright 2013 - 2020 United States Government as represented by the
 * Administrator of the National Aeronautics and Space Administration.
 * All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

window.onload = function () {
  // Seven day slider based off today, remember what today is
  var today = new Date();

  // Selected day to show on the map
  var day = new Date(today.getTime());

  // GIBS needs the day as a string parameter in the form of YYYY-MM-DD.
  // Date.toISOString returns YYYY-MM-DDTHH:MM:SSZ. Split at the 'T' and
  // take the date which is the first part.
  var dayParameter = function () {
    return day.toISOString().split('T')[0];
  };

  var map = new ol.Map({
    view: new ol.View({
      maxResolution: 0.5625,
      projection: ol.proj.get('EPSG:4326'),
      extent: [-180, -90, 180, 90],
      center: [0, 0],
      zoom: 2,
      maxZoom: 8
    }),
    target: 'map',
    renderer: ['canvas', 'dom']
  });

  function update() {
    // There is only one layer in this example, but remove them all
    // anyway
    clearLayers();

    // Add the new layer for the selected time
    map.addLayer(createLayer());

    // Update the day label
    document.querySelector('#day-label').textContent = dayParameter();
  };

  function clearLayers() {
    // Get a copy of the current layer list and then remove each
    // layer.
    var activeLayers = map.getLayers().getArray();
    for (var i = 0; i < activeLayers.length; i++) {
      map.removeLayer(activeLayers[i]);
    }
  };

  function createLayer() {
    var source = new ol.source.WMTS({
      url: 'https://gibs-{a-c}.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?TIME=' + dayParameter(),
      layer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
      format: 'image/jpeg',
      matrixSet: '250m',
      tileGrid: new ol.tilegrid.WMTS({
        origin: [-180, 90],
        resolutions: [
          0.5625,
          0.28125,
          0.140625,
          0.0703125,
          0.03515625,
          0.017578125,
          0.0087890625,
          0.00439453125,
          0.002197265625
        ],
        matrixIds: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        tileSize: 512
      })
    });

    var layer = new ol.layer.Tile({ source: source });
    return layer;
  };

  /*
      Create marker icon
  */
  var iconStyle = new ol.style.Style({
      image: new ol.style.Icon({
          anchor: [0.5, 50],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.75,
          src: 'images/marker.png'
      }),
      text: new ol.style.Text({
          font: '12px Arial',
          fill: new ol.style.Fill({ color: '#000' }),
          stroke: new ol.style.Stroke({
              color: '#fff', width: 2
          }),
          text: 'New marker text'
      })
  });
  /*
    Create map source
  */
 /*
    Create Icon
  */
  var lon = 21.002902;
  var lat = 52.228850;
  var MarkerIcon = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([lon,lat])),
      name: 'Marker text',
      desc: '<label>Details</label> <br> Latitude: ' + lat + ' Longitude: ' + lon
  })
  // Add icon style
  MarkerIcon.setStyle(new ol.style.Style({
      image: new ol.style.Icon({
          anchor: [0.5, 50],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: 'images/marker.png'
          // ,scale: 0.4
      })
  }));
  var MapSource = new ol.source.Vector({
      features: [
      ]
  })
  // Create map layer
  var MapLayer = new ol.layer.Vector({
      source: MapSource
  });
  // Set layer z-index
  MapLayer.setZIndex(999);
  // Add marker to layer
  map.addLayer(MapLayer);

  /*
      Events
  */
  //map.on('dblclick', function(evt)
  map.on('singleclick', function(evt)
  {
      var coordinatePretty = ol.coordinate.toStringHDMS(ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'), 2);
      var coordinate = ol.proj.toLonLat(evt.coordinate);

      console.log("Clicked at position: ", coordinatePretty, coordinate);
      console.log("Clicked at position: ", evt.coordinate);

      // Clear markers source
      MapSource.clear();

      // Add point
      var f = new ol.Feature({
          // From lon, lat
          // new ol.geom.Point(ol.proj.fromLonLat([4.35247, 50.84673])),
          // From event
          geometry: new ol.geom.Point(evt.coordinate),
          name: 'Marker text',
          desc: '<label>Details</label> <br> Latitude: ' + coordinate[1].toFixed(6) + ' Longitude: ' + coordinate[0].toFixed(6)
      });
      f.setStyle(iconStyle);

      // Add to source
      MapSource.addFeature(f);

      // Animate marker position
      AnimatePoint(f);

      // Set div coordinates
      SetDivLonLat(coordinate[0].toFixed(6), coordinate[1].toFixed(6));

      // Get lon, lat
      var coordinate = PointToLonLat(evt);
      // Show popup
      PopUp(coordinate[0], coordinate[1]);
  });

  function CenterMap(long, lat, zoom = 5)
  {
      console.log("New position Long: " + long + " Lat: " + lat);
      map.getView().setCenter(ol.proj.transform([long, lat], 'EPSG:4326', 'EPSG:3857'));
      map.getView().setZoom(zoom);
  }

  function SimpleMarker(lon, lat)
  {
      var layer = new ol.layer.Vector({
          source: new ol.source.Vector({
              features: [
                  new ol.Feature({
                      geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat]))
                  })
              ]
          })
      });
      map.addLayer(layer);
  }

  function SetMarker(evt)
  {
      // clear
      MapSource.clear();
      var feature = new ol.Feature({
          // Object
          geometry: new ol.geom.Point(ol.proj.fromLonLat([evt.lon, evt.lat])),
          // Event
          //geometry: new ol.geom.Point(evt.coordinate)
          name: 'Marker text',
          desc: '<label>Details</label> <br> Latitude: ' + evt.lat + ' Longitude: ' + evt.lon
      });
      feature.setStyle(iconStyle);
      MapSource.addFeature(feature);
      // Center
      CenterMap(evt.lon, evt.lat);
      // Set div
      SetDivLonLat(evt.lon, evt.lat);

  }

  function SetDivLonLat(lon,lat)
  {
      console.log(lon, lat, 'tak')
      //var loc = document.getElementById('location');
      //document.createElement('location')
      //loc.value = lon + ',' + lat;
      //console.log(loc, lon, lat);
      //console.log(loc, lon, lat);
  }


  // Show marker
  function MarkerOnTop(feature, show = false)
  {
      var style = feature.getStyle();
      if(show){
          style.zIndex = 9999;
          style.zIndex_ = 9999;
      }else{
          style.zIndex = 999;
          style.zIndex_ = 999;
      }
      console.log(style);
      feature.setStyle(style);
  }

  // Animate marker from faeture
  function AnimatePoint(feature, distance = 50, speed = 5)
  {
      console.log("Geometry: ", feature.getGeometry().getCoordinates());
      // var point = new ol.geom.Point(ol.proj.fromLonLat([evt.lon, evt.lat]));
      // Coordinates
      var c = feature.getGeometry().getCoordinates();
      var start = c[1];
      var end = start + distance;
      var curr = start;
      var up = true;

      window.setInterval(() => {
          if(up == true)
          {
              curr = curr + speed;
              var pos = [c[0], curr];
              // console.log("Current: ", pos);
              feature.getGeometry().setCoordinates(pos);
              if(curr > end)
              {
                  up = false;
              }
          }else{
              curr = curr - speed;
              var pos = [c[0], curr];
              // console.log("Current: ", pos);
              feature.getGeometry().setCoordinates(pos);
              if(curr < start)
              {
                  up = true;
              }
          }
      }, 35);
  }

  function PopUp(lon, lat)
  {
      var location = new ol.geom.Point(lon, lat).transform('EPSG:4326', 'EPSG:3857');

      console.log(document);
      var container = document.getElementById('popup');
      var content = document.getElementById('popup-content');
      var closer = document.getElementById('popup-closer');

      var overlay = new ol.Overlay({
          element: container,
          autoPan: true,
          autoPanAnimation: {
              duration: 250
          }
      });
      overlay.setPosition(ol.proj.fromLonLat([lon, lat]));
      map.addOverlay(overlay);

      closer.onclick = function() {
          overlay.setPosition(undefined);
          closer.blur();
          return false;
      };
  }

  //const closer = document.getElementById('popup-closer');
  //closer.onclick = function () {
  //overlay.setPosition(undefined);
  //closer.blur();
  //return false;
  //};

  //const content = document.getElementById('popup-content');
  //map.on('singleclick', function (evt) {
  //  const coordinate = evt.coordinate;
  //  const hdms = ol.coordinate.toStringHDMS(ol.proj.toLonLat(coordinate));

    //content.innerHTML = '<p>You clicked here:</p><code>' + hdms + '</code>';
  //  content.innerHTML = '<p>You clicked here:</p><code>' + coordinate + '</code>';
  //  console.log(coordinate);
  //  console.log(map.getView().getProjection());
    //ol.Overlay.setPosition(coordinate);
    //ol.overlay.setPosition(ol.proj.fromLonLat([13.12456, 47.59397]));
  //});


  update();

  // Slider values are in 'days from present'.
  document.querySelector('#day-slider')
    .addEventListener('change', function (event) {
      // Add the slider value (effectively subracting) to today's
      // date.
      var newDay = new Date(today.getTime());
      newDay.setUTCDate(today.getUTCDate() +
        Number.parseInt(event.target.value));
      day = newDay;
      update();
    });
};
