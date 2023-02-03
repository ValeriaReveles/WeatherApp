"use strict"
//setting token
let accessToken = mapbox_token;
mapboxgl.accessToken = mapbox_token;


//Map
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    zoom: 10, // starting zoom
    center: [-98.4916, 29.4252] // [lng, lat] for San Antonio
});

//Current location
let geoSanAntonio = new URLSearchParams({
    APPID: weather_api,
    lat: 29.4246,
    lon: -98.495141,
    units: "imperial"
})
    
let marker = new mapboxgl.Marker(
    {
        draggable:true
    }
)
.setLngLat([-98.495141, 29.4246])
.addTo(map);


function renderLocationAddress(){
    const renderLocation = document.querySelector(".current-location");
    let addMarker = marker.getLngLat();
    reverseGeocode(addMarker, mapbox_token).then(function(results) {
            console.log(results);
            let renderLocationHMTL = "";
            renderLocationHMTL += 
            `<h1">${results}</h1>`;
            renderLocation.innerHTML = renderLocationHMTL;
    })
}

renderLocationAddress(geoSanAntonio)


//update weather to reflect new location
function updatedWeather(){
    let currentMarker = new URLSearchParams({
        APPID: weather_api,
        lat: marker.getLngLat().lat,
        lon: marker.getLngLat().lng,
        units: "imperial"
    })
    renderLocationAddress(currentMarker)
    renderLocationName(currentMarker)
    renderWeatherForecast(currentMarker)
   // renderHourlyWeather(currentMarker)
}

marker.on("dragend", updatedWeather);


function renderWeatherForecast(geo){
    const icon = document.querySelectorAll(".icon");
    const dateRender = document.querySelectorAll(".current-day");
    const temperature = document.querySelectorAll(".temp");
    const summary = document.querySelectorAll(".summary");
    const queryWeather = `https://api.openweathermap.org/data/2.5/onecall?${geo}`
    fetch(queryWeather)
        .then(function (response) {
            return response.json();
}).then(function (data){                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
        for (let i = 0; i < 5; i++) {
            let date = new Date(data.daily[i].dt * 1000)
            console.log('Current date is: ',date)
            dateRender[i].textContent = date.toDateString();
            temperature[i].textContent = data.daily[i].temp.day + " °F";
            summary[i].textContent = data.daily[i].weather[0].description.toUpperCase();
            let icon1 = data.daily[i].weather[0].icon;
            icon[i].innerHTML = `<img src=" http://openweathermap.org/img/wn/${icon1}.png" style= 'height:5.5rem'/>`;
        }
        console.log('Entire weather API response: ', data);
        console.log('Current weather information: ', data.current);
        console.log('Weather for tomorrow: ', data.daily[1]);


    }) 
}

renderWeatherForecast(geoSanAntonio)


function renderLocationName(){
    let nameLat = marker.getLngLat().lat;
    let nameLon = marker.getLngLat().lng;
    const renderName = document.querySelectorAll(".location");
    let nameParams = new URLSearchParams({
        APPID: weather_api,
        lat: nameLat,
        lon: nameLon,
        limit: 2
    })
    fetch("http://api.openweathermap.org/geo/1.0/reverse?" + nameParams, {
        method: "GET"
    }
    ).then(async function (response) {
        return response.json();
    }).then(function (data){
        console.log(data);
        for (let i = 0; i < 5; i++) {
        renderName[i].textContent = data[0].name + ", " + data[0].country;
        }
    }) 
}

renderLocationName(geoSanAntonio)