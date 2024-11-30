
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('city');
    const searchButton = document.querySelector('.search-box button');
    
    // Allows for enter key to be used rather than only having the search button click
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            getWeather(); 
        }
    });

    //search button
    searchButton.addEventListener('click', getWeather);
});





function getWeather() {
    const container = document.querySelector('.container');
    const input = document.getElementById('city');
    const result = document.getElementById('result');

    // Validating input
    const cityName = input.value.trim();
    if (cityName === "") {
        alert("Please enter a city name");
        return;
    }

    // Encoding city name
    const encodedCityName = encodeURIComponent(cityName);

    // Expanding container
    container.classList.add('expanded');

    // Fetching weather data
    fetch(`https://fizagui2.pythonanywhere.com/weather?city=${encodedCityName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch weather data");
            }
            return response.json();
        })
        .then(data => {

            //switch case for importing images
            let weatherImage = "";
            switch (data.description.toLowerCase()) 
            {
                case "clear sky":
                    weatherImage = "Images/clear.png";
                    break;
                case "few clouds":
                    weatherImage = "Images/fewcloud.png";
                    break;
                case "scattered clouds":
                 weatherImage = "Images/scatteredcloud.png";
                    break;
                case "broken clouds":
                    weatherImage = "Images/brokencloud.png";
                    break;
                case "overcast clouds":
                    weatherImage = "Images/overcastcloud.png";
                    break;
                case "shower rain":
                case "light rain":
                case "rain":
                     weatherImage = "Images/rain.png";
                    break;
                case "thunderstorm":
                    weatherImage = "images/thunderstorm.png";
                    break;
                case "haze":
                    weatherImage = "Images/haze.png";
                    break;
                case "snow":
                    weatherImage = "Images/snow.png";
                    break;
                case "light intensity drizzle":
                    weatherImage = "Images/rain.png";
                    break;
                    
            }

            result.innerHTML = `
            <div class="weather-box">
    <div class="weather-info">
        <img src="${weatherImage}" alt="Weather Image">
        <div class="weather-details">
            <p class="humidity">Humidity Level: ${data.humidity}%</p>
            <p class="wind-speed">Wind Speed: ${data.wind_speed} m/s</p>
            <p class="feelsLike">Feels Like: ${data.feels_Like}°F</p>
        </div>
    </div>
    <h2>Weather in ${data.city}</h2>
    <p class="temperature">Temperature: <span>${data.temperature}°F</span></p>
    <p class="description">Condition: ${data.description}</p>
</div>
            `;
        })
        .catch(error => {
            // Displaying an error message in the result container
            result.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        });
}

document.addEventListener('click', (event) => {
    const container = document.querySelector('.container');
    const searchBox = document.querySelector('.search-box');
    const result = document.getElementById('result');

    // Checking if user has clicked outside the container in order to shrink container for a smooth transition
    if (!container.contains(event.target)) {
        // Collapse the container
        container.classList.remove('expanded');
        
        // Clears fields
        result.innerHTML = ''; 
        document.getElementById('city').value = ''; 
    }
});

