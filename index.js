function checkWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let temperature = response.data.temperature.current;
  let cityElement = document.querySelector("#city");
  let feelTemp = document.querySelector("#actual-feel");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let pressureEl = document.querySelector("#pressure");
  let timeElement = document.querySelector("#time");
  let date = new Date(response.data.time * 1000);
  let iconElement = document.querySelector("#icon");

  cityElement.innerHTML = response.data.city;
  timeElement.innerHTML = formatDate(date);

  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity} %`;
  windSpeedElement.innerHTML = `${response.data.wind.speed} km/h`;
  feelTemp.innerHTML = `${Math.round(response.data.temperature.feels_like)}°`;
  pressureEl.innerHTML = `${response.data.temperature.pressure} mmHg`;
  temperatureElement.innerHTML = Math.round(temperature);
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" id="icon" />`;
  getForecast(response.data.city);
}

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();

  let daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let day = daysOfWeek[date.getDay()];
  let month = months[date.getMonth()];
  let dayOfMonth = date.getDate();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day}, ${month} ${dayOfMonth} | ${hours}:${minutes}`;
}

function searchCity(city) {
  let apiKey = "0e6edd8o3a1bf93cac4e5tc0566fb691";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(checkWeather);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");

  searchCity(searchInput.value);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function getForecast(city) {
  let apiKey = "0e6edd8o3a1bf93cac4e5tc0566fb691";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml =
        forecastHtml +
        `
      <div class="weather-forecast-day">
        <div class="weather-forecast-date">${formatDay(day.time)}</div>

        <img src="${day.condition.icon_url}" class="weather-forecast-icon" />
        <div class="weather-forecast-temperatures">
          <div class="weather-forecast-temperature">
            <strong>${Math.round(day.temperature.maximum)}º</strong>
          </div>
          <div class="weather-forecast-temperature">${Math.round(
            day.temperature.minimum
          )}º</div>
        </div>
      </div>
    `;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

function convertToCelsius(fahrenheit) {
  return (fahrenheit - 32) * (5 / 9);
}

function convertToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

let temperatureInCelsius = true;

document.querySelector("#celsius").addEventListener("click", function () {
  if (!temperatureInCelsius) {
    temperatureInCelsius = true;
    let temperatureElement = document.querySelector("#temperature");
    let currentTemperature = parseInt(temperatureElement.innerHTML);
    let celsiusTemp = convertToCelsius(currentTemperature);
    temperatureElement.innerHTML = Math.round(celsiusTemp);
  }
});

document.querySelector("#fahrenheit").addEventListener("click", function () {
  if (temperatureInCelsius) {
    temperatureInCelsius = false;
    let temperatureElement = document.querySelector("#temperature");
    let currentTemperature = parseInt(temperatureElement.innerHTML);
    let fahrenheitTemp = convertToFahrenheit(currentTemperature);
    temperatureElement.innerHTML = Math.round(fahrenheitTemp);
  }
});

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Berlin");
