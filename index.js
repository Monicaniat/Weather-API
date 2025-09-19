let todayName = document.getElementById("today_date_day_name");
let todayNumber = document.getElementById("today_date_day_number");
let todayMonth = document.getElementById("today_date_month");
let todayLocation = document.getElementById("today_location");
let todayTemp = document.getElementById("today_temp");
let todayConditionImg = document.getElementById("today_condition_img");
let todayConditionText = document.getElementById("today_condition_text");
let humidity = document.getElementById("humidity");
let wind = document.getElementById("wind");
let windDirection = document.getElementById("wind_direction");

let nextDay = document.querySelector(".next-day-name");
let nextMaxTemp = document.querySelector(".next_max_temp");
let nextMinTemp = document.querySelector(".next_min_temp");
let nextConditionImg = document.querySelector(".next_condition_img");
let nextConditionText = document.querySelector(".next_condition_text");

let searchInput = document.getElementById("search");

let date = new Date("2025-09-19");
console.log('Test date:', date.getDate());
console.log('Test day name:', date.toLocaleDateString("en-US", { weekday: "long" }));
console.log('Test month:', date.toLocaleDateString("en-US", { month: "long" }));

async function getWeatherData(cityName) {
  try {
    let weatherResponse = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=4e7f51ebc5cb40429ef112226251909&q=${cityName}&days=3`
    );
    
    if (!weatherResponse.ok) {
      throw new Error(`HTTP error! status: ${weatherResponse.status}`);
    }
    
    let weatherData = await weatherResponse.json();
    console.log('Weather data fetched successfully for:', cityName);
    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

function displayTodayDate(data) {
  try {
    let todayDate = new Date();
    
    if (todayName) todayName.innerHTML = todayDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    if (todayNumber) todayNumber.innerHTML = todayDate.getDate();
    if (todayMonth) todayMonth.innerHTML = todayDate.toLocaleDateString("en-US", {
      month: "long",
    });
    
    if (todayLocation) todayLocation.innerHTML = data.location.name;
    if (todayTemp) todayTemp.innerHTML = Math.round(data.current.temp_c);
    
    if (todayConditionImg) {
      todayConditionImg.setAttribute("src", `https:${data.current.condition.icon}`);
      todayConditionImg.alt = data.current.condition.text;
    }
    if (todayConditionText) todayConditionText.innerHTML = data.current.condition.text;
    
    if (humidity) humidity.innerHTML = data.current.humidity + "%";
    if (wind) wind.innerHTML = data.current.wind_kph + " km/h";
    if (windDirection) windDirection.innerHTML = data.current.wind_dir;
    
    console.log('Today\'s weather data displayed successfully');
  } catch (error) {
    console.error('Error displaying today\'s weather data:', error);
  }
}

function displayNextData(data) {
  try {
    let forecastData = data.forecast.forecastday;
    
    if (forecastData && forecastData.length > 1) {
      let tomorrowData = forecastData[1];
      let nextDate = new Date(tomorrowData.date);
      
      if (nextDay) nextDay.innerHTML = nextDate.toLocaleDateString("en-US", {
        weekday: "long",
      });

      if (nextMaxTemp) nextMaxTemp.innerHTML = Math.round(tomorrowData.day.maxtemp_c);
      if (nextMinTemp) nextMinTemp.innerHTML = Math.round(tomorrowData.day.mintemp_c);
      
      if (nextConditionImg) {
        nextConditionImg.setAttribute("src", `https:${tomorrowData.day.condition.icon}`);
        nextConditionImg.alt = tomorrowData.day.condition.text;
      }
      if (nextConditionText) nextConditionText.innerHTML = tomorrowData.day.condition.text;
      
      console.log('Tomorrow\'s weather data displayed successfully');
    } else {
      console.error('Forecast data not available or insufficient');
    }
  } catch (error) {
    console.error('Error displaying tomorrow\'s weather data:', error);
  }
}

async function startApp(city = "cairo") {
  try {
    if (!city || city.trim() === '') {
      console.warn('No city provided, using default: cairo');
      city = 'cairo';
    }
    
    console.log(`Fetching weather data for: ${city.trim()}`);
    document.body.classList.add('loading');
    
    let weatherData = await getWeatherData(city.trim());
    
    displayTodayDate(weatherData);
    displayNextData(weatherData);
    
    document.body.classList.remove('loading');
    console.log('Weather app initialized successfully');
  } catch (error) {
    console.error('Failed to initialize weather app:', error);
    document.body.classList.remove('loading');
    alert(`Sorry, couldn't load weather data for "${city}". Please try another city.`);
  }
}

startApp();

if (searchInput) {
  let searchTimeout;
  
  searchInput.addEventListener("input", function () {
    const searchValue = searchInput.value.trim();
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    searchTimeout = setTimeout(() => {
      if (searchValue.length > 2) {
        startApp(searchValue);
      } else if (searchValue.length === 0) {
        startApp('cairo');
      }
    }, 500);
  });
  
  searchInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      const searchValue = searchInput.value.trim();
      if (searchValue.length > 0) {
        startApp(searchValue);
      }
    }
  });
} else {
  console.warn('Search input element not found');
}

function checkDOMElements() {
  const criticalElements = [
    { element: todayName, name: 'today_date_day_name' },
    { element: todayLocation, name: 'today_location' },
    { element: todayTemp, name: 'today_temp' },
    { element: searchInput, name: 'search' }
  ];
  
  criticalElements.forEach(item => {
    if (!item.element) {
      console.warn(`Critical DOM element missing: ${item.name}`);
    }
  });
}

document.addEventListener('DOMContentLoaded', checkDOMElements);

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', function() {
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});
