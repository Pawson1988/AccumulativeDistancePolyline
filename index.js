function initMap() {

  //------------------------------------------------------------------------------------------------------------------------
  let map;
  let CENTER = {
    lat: -34.397,
    lng: 150.644
  }
  const distancesDiv = document.querySelector(".distancesDiv")
  const divEl = document.querySelector(".divEl")
  const clearBtn = document.querySelector(".clearBtn")
  const removeLastBtn = document.querySelector(".removeLastBtn")

  let totalDistance = 0
  let index = 0
  let marker
  let markers = []
  let polylineCoords = []
  let distancePolyline
  let distancePolylines = []
  let distances = []
  let location

  //-----------------------------------------------------------------------------------------------------------------------
  // function to create markers
  function createMarker(position) {
    marker = new google.maps.Marker({
      position: position,
      map,
      title: "A marker"
    })

    markers.push(marker)
  }
  //------------------------------------------------------------------------------------------------------------------------
  function createAndSetPolyline() {
    if (polylineCoords.length > 1) {
      distancePolyline = new google.maps.Polyline({
        path: polylineCoords,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });
      distancePolylines.push(distancePolyline)
      distancePolyline.setMap(map)
    }
  }
  //------------------------------------------------------------------------------------------------------------------------
  function calculateAndSetDistance() {
    function computeDistance(google) {
      return google.computeDistanceBetween(polylineCoords[index], polylineCoords[index + 1])
    }

    if (polylineCoords.length > 1) {
      let distance = parseInt(computeDistance(google.maps.geometry.spherical) / 1000)
      distances.push(distance)
      distancesDiv.textContent = `Interval Distance: ${distances[distances.length -1]} KMs`
      totalDistance += distance
      index++
    }

    divEl.textContent = "Total Distance: " + totalDistance + " KMs"
  }
  //------------------------------------------------------------------------------------------------------------------------
  function reset() {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null)
    }
    for (let i = 0; i < distancePolylines.length; i++) {
      distancePolylines[i].setMap(null)
    }

    distancesDiv.textContent = "0"
    distances = []
    polylineCoords = []
    totalDistance = 0
		markers.length = 0
    index = 0

    divEl.textContent = "Total Distance: " + totalDistance
  }
  //------------------------------------------------------------------------------------------------------------------------
  function removeLast() {
		if(markers.length < 2){
			reset()
			return
		}
		
    let lastDistance = distancePolylines.length - 1
    let lastmarker = markers.length - 1

    if (distancePolylines.length > 0) {
      // remove last polyline
      distancePolylines[lastDistance].setMap(null)
      polylineCoords.pop()
      distancePolylines.pop()
    }
    if (markers.length > 0) {
      // remove last marker
      markers[lastmarker].setMap(null)
      markers.pop()
    }

    let deletedDistance = distances.pop()
    distancesDiv.textContent = `Interval Distance: ${distances[distances.length -1]} KMs`
    totalDistance -= deletedDistance
    index--
		divEl.textContent = "Total Distance: " + totalDistance
  }

  //------------------------------------------------------------------------------------------------------------------------
  map = new google.maps.Map(document.getElementById("map"), {
    center: CENTER,
    zoom: 2,
  });

  // add new markers and polylines on click. 
  map.addListener("click", (e) => {
    location = e.latLng
    createMarker(location)
    polylineCoords.push(location)
    if (polylineCoords.length > 1) {
      createAndSetPolyline()
      calculateAndSetDistance()
    }


    if (markers.length > 0) {
      google.maps.event.addListener(marker, "click", function() {
        let pos = this.getPosition()
        location = pos
        createMarker(pos)
        polylineCoords.push(pos)
        createAndSetPolyline()
        calculateAndSetDistance()
      })
    }
  })


  removeLastBtn.addEventListener("click", function() {
    removeLast()
  })
  // Reset everything!
  clearBtn.addEventListener("click", () => {
    reset()
  })

}

window.initMap = initMap;
