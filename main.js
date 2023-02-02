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

function updatedWeather(){
    let currentMarker = new URLSearchParams({
        APPID: weather_api,
        lat: marker.getLngLat().lat,
        lon: marker.getLngLat().lng,
        units: "imperial"
    })
    renderWeatherForecast(currentMarker)
    // renderHourlyWeather(currentMarker)
}

marker.on("dragend", updatedWeather)


function renderWeatherForecast(geo){
    const icon = document.querySelectorAll(".icon");
    const temperature = document.querySelectorAll(".temp");
    const summary = document.querySelectorAll(".summary");
    const loc = document.querySelectorAll(".location");
    const queryWeather = `https://api.openweathermap.org/data/2.5/forecast?${geo}`
    fetch(queryWeather)
        .then(function (response) {
            return response.json();
        }).then(function (data){
        console.log(data)
        for (let i = 0; i < 5; i++) {
            temperature[i].textContent = data.list[i].main.temp + " °F";
            summary[i].textContent = data.list[i].weather[0].description;
            loc[i].textContent = data.city.name;
            let icon1 = data.list[i].weather[0].icon;
            icon[i].innerHTML = `<img src=" http://openweathermap.org/img/wn/${icon1}.png" style= 'height:5.5rem'/>`;
        }
        console.log('Entire weather API response: ', data);
        console.log('Current weather information: ', data.list[0].main);
        console.log('Weather for tomorrow: ', data.list[1]);

    }) 
}

renderWeatherForecast(geoSanAntonio)

