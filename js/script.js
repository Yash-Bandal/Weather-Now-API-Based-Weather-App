let isCelsius = false;

async function getWeather() {
    const city = document.getElementById('city-input').value.trim();
    if (!city) {
        document.getElementById('weather-result').innerHTML = '<p class="error">Please enter a city name.</p>';
        return;
    }

    const url = `https://yahoo-weather5.p.rapidapi.com/weather?location=${encodeURIComponent(city)}&format=json&u=f`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '34e17e0826mshe25f2d73f913ec0p12782fjsn0bb38de57a22', // Replace with your valid API key
            'x-rapidapi-host': 'yahoo-weather5.p.rapidapi.com'
        }
    };

    try {
        document.getElementById('weather-result').innerHTML = '<p class="loading">Fetching weather data...</p>';
        document.getElementById('forecast').innerHTML = '';

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debugging log

        if (!data.location) {
            throw new Error('City not found');
        }

        let temp = data.current_observation.condition.temperature;
        let tempUnit = '°F';
        if (isCelsius) {
            temp = ((temp - 32) * 5 / 9).toFixed(1);
            tempUnit = '°C';
        }

        document.getElementById('weather-result').innerHTML = `
    <h3>${data.location.city}, ${data.location.country}</h3>
    <p><strong>Temperature:</strong> ${temp}${tempUnit}</p>
    <p><strong>Condition:</strong> ${data.current_observation.condition.text}</p>
    <p><strong>Humidity:</strong> ${data.current_observation.atmosphere.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${data.current_observation.wind.speed} mph</p>
    <p><strong>Sunrise:</strong> ${data.current_observation.astronomy.sunrise}</p>
    <p><strong>Sunset:</strong> ${data.current_observation.astronomy.sunset}</p>
    `;

        let forecastHTML = '';
        data.forecasts.slice(0, 7).forEach(day => {
            let high = day.high, low = day.low;
            if (isCelsius) {
                high = ((high - 32) * 5 / 9).toFixed(1);
                low = ((low - 32) * 5 / 9).toFixed(1);
            }
            forecastHTML += `
    <div class="forecast-item">
        <p><strong>${day.day}</strong></p>
        <p>${new Date(day.date * 1000).toDateString()}</p>
    // in your loop:
            <img
            src="https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/${day.code}d.png"
            alt="${day.text}"
            />


        
            <p>${day.text}</p>
            <p>High: ${high}${tempUnit}</p>
            <p>Low: ${low}${tempUnit}</p>
    </div>
    `;
        });
        document.getElementById('forecast').innerHTML = forecastHTML;

    } catch (error) {
        document.getElementById('weather-result').innerHTML = `<p class="error">Error: ${error.message}</p>`;
        console.error(error);
    }
}

function toggleUnit() {
    isCelsius = !isCelsius;
    getWeather();
}

function refreshPage() {
    document.getElementById('city-input').value = '';
    document.getElementById('weather-result').innerHTML = '';
    document.getElementById('forecast').innerHTML = '';
}
