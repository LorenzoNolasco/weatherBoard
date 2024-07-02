//capture DOM references in variables
const APIKey = "135aac91bf29e00ad78ffcaeebf22594";
const cityInputEl = document.querySelector("#city-name-search");

//capture user input

function handleFormSubmit(event) {
  event.preventDefault();
  let city = cityInputEl.value;
  if (city) {
    saveSearch(city);
    currentWeather(city);
  }
}

//capture current day weather

function currentWeather(city) {
  //make api call for daily forecast
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      renderCurrentWeather(data); //call function to display current weather data
      const { lat, lon } = data.coord;
      //make api call for 5 day forecast
      const apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKey}`;
      fetch(apiUrlForecast)
        .then((response) => response.json())
        .then((data) => {
          fiveDayForecast(data); //call function to display 5 day forecast
        });
    });
}
//then dynamically create element to display

function renderCurrentWeather(data) {
  const todayEl = document.querySelector("#current-weather");
  todayEl.innerHTML = "";
  const titleEl = document.createElement("h1");
  titleEl.textContent = "Current Weather:";
  todayEl.appendChild(titleEl);
  const nameEl = document.createElement("h2");
  nameEl.textContent = data.name;

  const dateEl = document.createElement("h4");
  dateEl.textContent = dayjs.unix(data.dt).format("MM/DD/YYYY");

  const tempEl = document.createElement("p");
  tempEl.textContent = "Temp:  " + Math.round(data.main.temp) + " F";

  const humidEl = document.createElement("p");
  humidEl.textContent = "Humidity:  " + data.main.humidity + " %";

  const windEl = document.createElement("p");
  windEl.textContent = "Wind Speed:  " + Math.round(data.wind.speed) + " mph";

  const iconEl = document.createElement("img");
  const iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  iconEl.src = iconUrl;

  todayEl.append(nameEl, dateEl, iconEl, tempEl, humidEl, windEl);
}

function fiveDayForecast(data) {
  const forecastEl = document.querySelector("#five-day-forecast");
  forecastEl.innerHTML = "";
  const titleEl = document.createElement("h3");
  titleEl.textContent = "5-Day Forecast:";
  forecastEl.appendChild(titleEl);

  // Create a container div for forecast items
  const forecastContainer = document.createElement("div");
  forecastContainer.classList.add("five-day-forecast");
  //let i = 6 because returned data has multiple temps per day, so 6th is middle of day
  for (let i = 6; i < data.list.length; i += 8) {
    const forecastItem = document.createElement("div"); //create div element
    forecastItem.classList.add("forecast-item"); //add class to div element

    const dateEl = document.createElement("h4");
    dateEl.textContent = dayjs.unix(data.list[i].dt).format("MM/DD/YYYY");

    const tempEl = document.createElement("p");
    tempEl.textContent = "Temp:  " + Math.round(data.list[i].main.temp) + " F";

    const humidEl = document.createElement("p");
    humidEl.textContent = "Humidity:  " + data.list[i].main.humidity + " %";

    const windEl = document.createElement("p");
    windEl.textContent =
      "Wind Speed:  " + Math.round(data.list[i].wind.speed) + " mph";

    const iconEl = document.createElement("img");
    const iconUrl = `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`;
    iconEl.src = iconUrl;

    forecastItem.append(dateEl, iconEl, tempEl, humidEl, windEl);
    forecastContainer.appendChild(forecastItem);
  }
  forecastEl.appendChild(forecastContainer); // Append the container with forecast items
}

//add event listener to the button, call a function

document
  .querySelector("#submit-search")
  .addEventListener("click", handleFormSubmit);

$(document).ready(function () {
  displaySearchHistory();
});

//local storage display
function saveSearch(city) {
  let searches = JSON.parse(localStorage.getItem("searchHistory")) || []; // Get existing searches or initialize an empty array
  if (!searches.includes(city)) {
    // If the search term is not already saved
    searches.push(city); // Add the new search term to the array
    localStorage.setItem("searchHistory", JSON.stringify(searches)); // Save the updated array to local storage
    displaySearchHistory(city); // Update the search history display
  }
}

// Function to display search history
function displaySearchHistory() {
  const historyContainer = document.getElementById("history"); // Get the history container element
  historyContainer.innerHTML = ""; // Clear the current history display
  let searches = JSON.parse(localStorage.getItem("searchHistory")) || []; // Get existing searches or initialize an empty array
  searches.forEach((city) => {
    // For each search term
    const searchItem = document.createElement("button"); // Create a new button element
    searchItem.classList.add(
      "list-group-item",
      "list-group-item-action",
      "search-button"
    ); // Add classes to the button
    searchItem.textContent = city; // Set the button text to the search term
    searchItem.addEventListener("click", function () {
      // Add click event listener to the button
      currentWeather(city); // Fetch coordinates for the clicked search term
    });
    historyContainer.appendChild(searchItem); // Add the button to the history container
  });
}
