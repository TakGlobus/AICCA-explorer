var markers = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        src: 'http://www.clker.com/cliparts/W/0/g/a/W/E/map-pin-red.svg'
      })
    })
  });
  map.addLayer(markers);
  
  var marker = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([2.2931, 48.8584])));
  markers.getSource().addFeature(marker);
  
  // 'map' is your map created using new OpenLayers.Map(options)
  markers = new ol.layer.Vector( "Markers" );
  markers.id = "Markers";
  map.addLayer(markers);
  map.events.register("click", map, function(e) {
        //var position = this.events.getMousePosition(e);
        var position = map.getLonLatFromPixel(e.xy);
        var size = new ol.Size(21,25);
    var offset = new ol.Pixel(-(size.w/2), -size.h);
    var icon = new ol.Icon('image/marker.png', size, offset);   
    var markerslayer = map.getLayer('Markers');

    markerslayer.addMarker(new ol.Marker(position,icon));

    });
