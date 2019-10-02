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
            `<li class="js-trail-list"><h3><img src="${responseJson.trails[i].imgSmall}" class="trail-thumb">${responseJson.trails[i].name}</h3><p>${responseJson.trails[i].summary}</p><ul><li>Length: ${responseJson.trails[i].length} mi</li><li>Difficulty: ${responseJson.trails[i].difficulty}</li><li>Trail Condition: ${responseJson.trails[i].conditionStatus}</li></ul><div class="weather-section"><div class="icon-border"></div><div class="weather-card"><h4>${responseJson.trails[i].weather_date_1}</h4><img src="icons/${responseJson.trails[i].weather_icon_descr_1}.png" class="weather-icon" alt="weather icon"><div class="weather-container"><h4>${responseJson.trails[i].weather_temp_1}&#8457</h4></div></div><div class="icon-border"></div><div class="weather-card"><h4>${responseJson.trails[i].weather_date_2}</h4><img src="icons/${responseJson.trails[i].weather_icon_descr_2}.png" class="weather-icon" alt="weather icon"><div class="weather-container"><h4>${responseJson.trails[i].weather_temp_2}&#8457</h4></div></div><div class="icon-border"></div><div class="weather-card"><h4>${responseJson.trails[i].weather_date_3}</h4><img src="icons/${responseJson.trails[i].weather_icon_descr_3}.png" class="weather-icon" alt="weather icon"><div class="weather-container"><h4>${responseJson.trails[i].weather_temp_3}&#8457</h4></div></div></div>`
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
            const weatherURL = 'https://api.weatherbit.io/v2.0/forecast/daily';


            const weatherParams = {
                lat: responseJson.trails[i].latitude,
                lon: responseJson.trails[i].longitude,
                days: 3,
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
                responseJson.trails[i].weather_date_1 = weatherResponse.data[0].datetime.substring(5, 10);
                responseJson.trails[i].weather_icon_descr_1 = weatherResponse.data[0].weather.icon; 
                responseJson.trails[i].weather_temp_1 = Math.round(weatherResponse.data[0].temp*(9/5) + 32);
                responseJson.trails[i].weather_date_2 = weatherResponse.data[1].datetime.substring(5, 10);
                responseJson.trails[i].weather_icon_descr_2 = weatherResponse.data[1].weather.icon;
                responseJson.trails[i].weather_temp_2 = Math.round(weatherResponse.data[1].temp*(9/5) + 32);
                responseJson.trails[i].weather_date_3 = weatherResponse.data[2].datetime.substring(5, 10);
                responseJson.trails[i].weather_icon_descr_3 = weatherResponse.data[2].weather.icon;
                responseJson.trails[i].weather_temp_3 = Math.round(weatherResponse.data[2].temp*(9/5) + 32);
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
        console.log(locationCoords);
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


