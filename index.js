'use strict'
//return to search
function returnToSearch () {
    $('#home-button').on('click', function () {
        // console.log('return home');
        $('#trail-results').addClass('hidden');
        $('#background-img').removeClass('hidden');
        $('#search').removeClass('hidden');
    });
} 


//display trails results in DOM
function displayTrails(responseJson) {
    // console.log(responseJson);
    $('#js-trail-results-list').empty();
    for (let i = 0; i < responseJson.trails.length; i++) {
        $('#js-trail-results-list').append(
            `<li class="js-trail-list"><h3><img src="${responseJson.trails[i].imgSmall}" class="trail-thumb">${responseJson.trails[i].name}</h3><p>${responseJson.trails[i].summary}</p><ul><li>Length: ${responseJson.trails[i].length} mi</li><li>Difficulty: ${responseJson.trails[i].difficulty}</li><li>Trail Condition: ${responseJson.trails[i].conditionStatus}</li><li><img src="icons/${responseJson.trails[i].weather_icon_descr}.png" class="weather-icon"><span>Temp: ${responseJson.trails[i].weather_temp}</span></li>`
        )}
    $('#background-img').addClass('hidden');
    $('#search').addClass('hidden');
    $('#trail-results').removeClass('hidden');
}

//format weather GET query
function formatWeatherParams(weatherParams) {
    const queryItems = Object.keys(weatherParams)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(weatherParams[key])}`)
    return queryItems.join('&');
}

//format trail GET query
function formatParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

//GET requests to trail API and weather API:
function getData(position) {
    // console.log(position);
    const trailKey = '200336642-7ec33389ef4df8d74aa21116b59cd0dc';
    const trailURL = 'https://www.hikingproject.com/data/get-trails';

    const params = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        maxDistance: 50,
        maxResults: 1,
        key: trailKey
    };
    const queryString = formatParams(params);
    const tURL = trailURL + '?' + queryString;
    console.log(tURL);

    fetch(tURL)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.message);
    })
    .then(function(responseJson) {
        console.log(responseJson);

        for (let i = 0; i < responseJson.trails.length; i++) {
            // console.log(responseJson.trails[i].latitude + ',' + responseJson.trails[i].longitude);
            
            // for each trail make a request to weather API
            const weatherKey = 'dee4a3ec68e94a8f8ad37abac35869f2';
            // const weatherID = '2d57026a'
            const weatherURL = 'https://api.weatherbit.io/v2.0/current';


            const weatherParams = {
                lat: responseJson.trails[i].latitude,
                lon: responseJson.trails[i].longitude,
                key: weatherKey
                // app_id: weatherID,
                // app_key: weatherKey
                // query: responseJson.trails[i].latitude + ',' + responseJson.trails[i].longitude,
                // forcast_days: 7,
                // units: 'f'
            };

            // const weatherCoords = responseJson.trails[i].latitude + ',' + responseJson.trails[i].longitude;

            const weatherString = formatWeatherParams(weatherParams);
            const wURL = weatherURL + '?' + weatherString;

            console.log(wURL);
            
            //for each trail display the description and temperature
            fetch(wURL)
            .then(response => response.json())
            .then(function returnWeather(weatherResponse) {
                // console.log(weatherResponse.data[0].temp);
                responseJson.trails[i].weather_icon_descr = weatherResponse.data[0].weather.icon 
                responseJson.trails[i].weather_temp = weatherResponse.data[0].temp;
                if (i == responseJson.trails.length - 1) {
                    displayTrails(responseJson);
            }})
        }
    })
    .catch(error => {
        $('#js-error-message').text(`Something went wrong: ${error.message}`)
    });
}

//find user location
function requestLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getData);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

//listen for submit
function watchSubmit() {
    $('#loc-trail-search').click(event => {
        // console.log('button clicked')
        requestLocation();
    });
}

//geocode location input by user
function searchLocation (searchValue) {
    // console.log(searchValue);

    const geoKey = 'hfOaz02p26S6Ug5zqlaUhL0IxBII8f29';
    const geoURL = 'https://www.mapquestapi.com/geocoding/v1/address';

    const geoParams = {
        key: geoKey,
        location: searchValue
    };
    // console.log(geoParams.location);

    const geoString = formatParams(geoParams);
    const gURL = geoURL + '?' + geoString;
    
    console.log(gURL);

    fetch(gURL)
    .then(response => response.json())
    .then(function returnCoords(locationCoords) {
        // console.log(locationCoords);
        // console.log(locationCoords.results[0].locations[0].displayLatLng.lat);

        const position = {coords: {
            latitude: locationCoords.results[0].locations[0].displayLatLng.lat,
            longitude: locationCoords.results[0].locations[0].displayLatLng.lng
        }};
        // console.log(position.coords.latitude);
        getData(position);
    });
}

//listen for search
function watchSearch() {
    $('#location-search').click(function(event){
        event.preventDefault();
        // console.log('search location');
        let searchValue = $('#js-trail-search').val().toLowerCase().replace(/ /g,'');

        // console.log(searchValue);
        searchLocation(searchValue);
    })
}

function startSearch () {
    watchSubmit();
    watchSearch();
    returnToSearch();
};

$(startSearch);


