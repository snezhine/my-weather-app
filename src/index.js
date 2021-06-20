// Get current Displayed Date

let now = new Date();

function formatDate(date) {
  let todayDate = date.getDate();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[date.getMonth()];
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${hours}`;
  }
  let year = date.getFullYear();
  let outputDate = document.querySelector("#current-date");
  outputDate.innerHTML = `${day}, ${month} ${todayDate} ${year}`;
  let outputTime = document.querySelector("#current-time");
  outputTime.innerHTML = `${hours}:${minutes}`;
  console.log(
    `today is ${day}, ${month} ${todayDate} ${year}, ${hours}:${minutes}`
  );
}
formatDate(now);

// switch between F and C

function getFahren(event) {
  event.preventDefault();
  celcius.classList.remove("active");
  fahren.classList.add("active");
  let currentTemp = document.querySelector("#current-temp").textContent;
  //console.log(currentTemp);
  currentTemp = currentTemp.substring(0, currentTemp.length - 2);
  //console.log(currentTemp);
  // translate C to F
  let fahrenTemp = Math.round((currentTemp * 9) / 5 + 32);
  let newFahren = document.querySelector("#current-temp");
  newFahren.innerHTML = `${fahrenTemp}°F`;
}

function getCelcius(event) {
  event.preventDefault();
  celcius.classList.add("active");
  fahren.classList.remove("active");
  let currentTemp = document.querySelector("#current-temp").textContent;
  currentTemp = currentTemp.substring(0, currentTemp.length - 2);
  let celciusTemp = Math.round(((currentTemp - 32) * 5) / 9);
  let newCelsius = document.querySelector("#current-temp");
  newCelsius.innerHTML = `${celciusTemp}°C`;
}

// show weather in selected city
function showWeather(response) {
  console.log(response);

  // replace city name, country with API response
  let city = response.data.name;
  let country = response.data.sys.country;
  document.querySelector("#displayed-city").innerHTML = `${city}, ${country}`;

  // temperature response now
  let temp = Math.round(response.data.main.temp);
  let currentTemp = document.querySelector("#current-temp");
  currentTemp.innerHTML = `${temp}°C`;

  // show today min temperature
  let temperatureMin = Math.round(response.data.main.temp_min);
  let temperatureElementMin = document.querySelector("#temperature-min");
  temperatureElementMin.innerHTML = `min ${temperatureMin}°C`;

  // show today max temperature
  let temperatureMax = Math.round(response.data.main.temp_max);
  let temperatureElementMax = document.querySelector("#temperature-max");
  temperatureElementMax.innerHTML = `max ${temperatureMax}°C`;

  // show humidity
  let humidity = response.data.main.humidity;
  let humidityNow = document.querySelector("#current-humidity");
  humidityNow.innerHTML = `Humidity: ${humidity} %`;

  // show wind speed
  let wind = Math.round(response.data.wind.speed);
  let windSpeed = document.querySelector("#current-wind");
  windSpeed.innerHTML = `Wind: ${wind} kmh`;

  // show sunrise
  let unix_sunrise = response.data.sys.sunrise;
  // Create a new JavaScript Date object based on the timestamp
  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
  let date = new Date(unix_sunrise * 1000);
  // Hours part from the timestamp
  let hours = date.getHours();
  // Minutes part from the timestamp
  let minutes = "0" + date.getMinutes();

  // Will display time in 10:30:23 format
  let formattedTimeSunrise = hours + ":" + minutes.substr(-2);
  let sunrise = document.querySelector("#sunrise");
  sunrise.innerHTML = `Sunrise at ${formattedTimeSunrise}`;

  // show sunset
  let unix_sunset = response.data.sys.sunset;
  let dateSunset = new Date(unix_sunset * 1000);
  let hoursSunset = dateSunset.getHours();
  let minutesSunset = "0" + dateSunset.getMinutes();
  let formattedTimeSunset = hoursSunset + ":" + minutesSunset.substr(-2);
  let sunset = document.querySelector("#sunset");
  sunset.innerHTML = `Sunset at ${formattedTimeSunset}`;

  // show weather description now(today)
  let description = response.data.weather[0].description;
  let descriptionNow = document.querySelector("#description");
  descriptionNow.innerHTML = `${description}`;
}

// get searched (desired) city

function search(city) {
  //debugger;
  let key = "d082e40188c2fac77c51a3d5e63e80ab";
  let units = "metric";
  let apiEndPoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiCity = `${apiEndPoint}q=${city}&appid=${key}&units=${units}`;
  //const axios = require("axios").default; when to use this?
  console.log(`getting data for ${city} in ${units} units`);
  console.log(apiCity);
  axios.get(apiCity).then(showWeather);
}

function searchClick(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-input").value;
  search(cityInput);
}

// get current location

function showPosition(position) {
  let latitude = position.coords.latitude;
  let longtitude = position.coords.longitude;
  let units = "metric";
  console.log(`your current location is ${latitude} and ${longtitude}`);
  console.log(`getting data in ${units} uinits`);
  let apiKey = "d082e40188c2fac77c51a3d5e63e80ab";
  let apiEndPoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiURLCurrent = `${apiEndPoint}lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${units}`;
  //const axios = require('axios').default; when to use this?
  console.log(apiURLCurrent);
  axios.get(apiURLCurrent).then(showWeather);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}
// load current on window open
function getCurrentPositionOnLoad() {
  navigator.geolocation.getCurrentPosition(showPosition);
}
window.onpaint = search("Berlin");

// buttons

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchClick);

let button = document.querySelector("#current-location-button");
button.addEventListener("click", getCurrentPosition);

// note: neeed to add a one time click to C or F buttons
// otherwise user can click the F/C conversion several times and the result is incorrect

let fahrenButton = document.querySelector("#fahren-button");
fahrenButton.addEventListener("click", getFahren);

let celciusButton = document.querySelector("#celcius-button");
celciusButton.addEventListener("click", getCelcius);
