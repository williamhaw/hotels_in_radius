var map;
var service;
var marker;
var cityCircle;
var infowindow;
var hotelMarkers;

function initMap() {

  var initialCity = new google.maps.LatLng(1.351863, 103.819742);

  map = new google.maps.Map(
      document.getElementById('map'), {center: initialCity, zoom: 10});

  var inputForm = document.getElementById('inputForm');
  var cityName = document.getElementById('cityName');
  var autocomplete = new google.maps.places.Autocomplete(cityName);
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(inputForm);

  autocomplete.bindTo('bounds', map);

  service = new google.maps.places.PlacesService(map);

  autocomplete.addListener('place_changed', function() {
    if (marker) {marker.setVisible(false);}
    if (cityCircle) {cityCircle.setVisible(false);}
    var place = autocomplete.getPlace();
    
    createMarker(place)

    if (infowindow) infowindow.close();
    infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);
    infowindowContent.children['place-icon'].src = place.icon;
    infowindowContent.children['place-coordinates'].textContent = place.geometry.location;

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(infowindowContent);
      infowindow.open(map, this);
    });

    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(8);
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var hotelRequest = {
      type: "lodging",
      location: place.geometry.location,
      radius: 50000
    };

    service.nearbySearch(hotelRequest, function(results, status, pagination){

      if(hotelMarkers){
        hotelMarkers.forEach(function(marker){
          marker.setMap(null);
        });
      }

      hotelMarkers = []
      results.forEach(function(result) {
        var hotelMarker = new google.maps.Marker({
          position: result.geometry.location,
          map: map,
          icon: {
            scaledSize: new google.maps.Size(16, 16),
            url: result.icon,
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(0, 0)
          }
        });

        hotelMarkers.push(hotelMarker);
      });
    });
  });
}

function createMarker(place) {
  marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  cityCircle = new google.maps.Circle({
      strokeColor: '#00B2FF',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#0000FF',
      fillOpacity: 0.15,
      map: map,
      center: place.geometry.location,
      radius: getRadius()
    });
}

function getRadius() {
  return parseInt(document.getElementById("radius").value) * 1000
}

function changeRadius() {
    if(cityCircle){
      cityCircle.setRadius(getRadius())
    }
}