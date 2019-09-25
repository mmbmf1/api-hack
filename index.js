'use strict'

//display trails results in DOM
function displayTrails(responseJson) {
    console.log(responseJson);
    $('#js-trail-results-list').empty();
    for (let i = 0; i < responseJson.trails.length; i++) {
        $('#js-trail-results-list').append(
            `<li class="js-trail-list"><h3><img src="${responseJson.trails[i].imgSmall}" class="trail-thumb">${responseJson.trails[i].name}</h3><p>${responseJson.trails[i].summary}</p><ul><li>Length: ${responseJson.trails[i].length} mi</li><li>Difficulty: ${responseJson.trails[i].difficulty}</li><li>Trail Condition: ${responseJson.trails[i].conditionStatus}</li><li>Lat: ${responseJson.trails[i].latitude}, Lon: ${responseJson.trails[i].longitude}</li>`
        )}
    $('#search').addClass('hidden');
    $('#trail-results').removeClass('hidden');
}

//format trail GET query
function formatTrailParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}


//GET trail list from API
function getTrails(position) {
    const trailKey = '200336642-7ec33389ef4df8d74aa21116b59cd0dc';
    const trailURL = 'https://www.hikingproject.com/data/get-trails';

    const params = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        maxDistance: 50,
        key: trailKey
    };
    const queryString = formatTrailParams(params);
    const tURL = trailURL + '?' + queryString;
    console.log(tURL);

    fetch(tURL)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.message);
    })
    .then(responseJson => displayTrails(responseJson))
    .catch(error => {
        $('#js-error-message').text(`Something went wrong: ${error.message}`);
    });
  }

//find user location
function requestLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getTrails);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

//listen for submit
function watchSubmit() {
    $('#loc-trail-search').click(event => {
        console.log('button clicked')
        requestLocation();
    });
}

$(watchSubmit);