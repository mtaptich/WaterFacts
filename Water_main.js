var app = angular.module('Waterapp', ['ngDropdowns', 'ui.bootstrap'])

// Text environment function
app.directive('evt', function() {
  function link(scope, el, attr) {
    var label = attr.label
    var bg = attr.bg
    scope.labelstyle = { backgroundColor: bg }
    scope.label = attr.label
  }
  return {
    link: link,
    scope: {},
    restrict: 'E',
    template: function(elem, attr){
        return '<div ng-style="labelstyle">{{label}}</div>'
    }
  }
})

app.directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
        element.css({
            'background-image': 'url(' + url +')',
            'background-size' : 'cover'
        });
    };
});

app.directive("popoverHtmlUnsafePopup", function () {
      return {
        restrict: "EA",
        replace: true,
        scope: { title: "@", content: "@", placement: "@", animation: "&", isOpen: "&" },
        templateUrl: "popover-html-unsafe-popup.html"
      };
    })

    .directive("popoverHtmlUnsafe", [ "$tooltip", function ($tooltip) {
      return $tooltip("popoverHtmlUnsafe", "popover", "mouseenter");
    }]);


app.directive('sL', function() {

  return {
    controller: function ($scope) {
      $scope.water = 0;
    },
    link: function(scope, element, attrs) {
            scope.water = 0;
            markers = [], polyline = null
            var myOptions = {
                zoom: 10,
                center: new google.maps.LatLng(37.774, -122.308),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById(attrs.id), myOptions);
            directionsService = new google.maps.DirectionsService();
            
            google.maps.event.addListener(map, 'click', function(e){ 
              if(markers.length <2) addMarker(e.latLng, scope)
            });
    

            function calcRoute(scope) {
                var modeSelect = google.maps.DirectionsTravelMode.DRIVING,
                    origin = markers[0].getPosition(),
                    destination = markers[markers.length - 1].getPosition(),
                    waypoints = [];

                for (var i = 1; i < markers.length - 1; i++) {
                  waypoints.push({
                    location: markers[i].getPosition(),
                    stopover: true
                  });
                }
                
                var request = { origin: origin, destination: destination, waypoints: waypoints, provideRouteAlternatives: false, durationInTraffic: true,travelMode: modeSelect
                };
                 
                directionsService.route(request, function(response, status) {
                  if (status == google.maps.DirectionsStatus.OK) {
                    if (polyline) {
                      for (i=0; i<line.length; i++){                           
                        line[i].setMap(null);
                      }
                    }

                  collectdata(response, scope);
                 
                  } else if (status == google.maps.DirectionsStatus.ZERO_RESULTS) {
                    alert("Could not find a route between these points");
                  } else {
                    alert("Directions request failed");
                  } 
                });
            } 

            function addMarker(latlng, scope){
              // Update Marker
              var markSetup = {position: latlng, map: map, draggable: true}
              
              marker = new google.maps.Marker(markSetup)
              
              // Add listener
              google.maps.event.addListener(marker, 'dragend', function(){calcRoute(scope)});
              
              markers.push(marker);

              if (markers.length>1) calcRoute(scope)
            }

            function collectdata(response, scope){
              //Initialize variables
              line = [], data = [];
              var ourRoute = response.routes[0], index = -1;;

              //Calculate emissions along route
              var zLen = ourRoute.legs.length;
              for (var z = 0; z < zLen; z++) {
                totdist = 0
                for (var j = 0; j < ourRoute.legs[z].steps.length; j++) {
                  index = index + 1;
                  var path = [];  
                  for (var i = 0; i < ourRoute.legs[z].steps[j].path.length; i++) {
                    path.push(ourRoute.legs[z].steps[j].path[i]);
                  }

                  var distance = ourRoute.legs[z].steps[j].distance.value;
                  totdist = totdist + distance; 
                  if(typeof response.routes[0].legs[z].steps[j] != 'undefined' ){
                    var vel = distance/response.routes[0].legs[z].steps[j].duration.value;

                    var colorline = "#00cc33"
                    polyline = new google.maps.Polyline({ path: path, strokeColor: colorline, map: map });
                    line.push(polyline);


                    scope.water = Math.round(totdist/1000 *0.13*10)/10
                    scope.$apply()

                    console.log(scope.water)

                  }
                }
              }       
            }
            
            
        },
    replace: true,
    restrict: 'E',
    template: function(elem, attr){
        return '<div>{{water}}</div>'
    }
  }
})

