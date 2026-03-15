
        // Simple function to display logs in our black box
        function addLog(text) {
            var logBox = document.getElementById('logBox');
            logBox.innerHTML = logBox.innerHTML + "<div> > " + text + "</div>";
        }

        // The Main Async function for fetching weather
        async function getWeatherData(city) {
            var infoDiv = document.getElementById('weatherInfo');
            var logBox = document.getElementById('logBox');
            
            
            if (city == "") {
                alert("Please enter a city!");
                return;
            }

            logBox.innerHTML = ""; // Clear console for new search

            // --- DEMONSTRATING EVENT LOOP ---
            addLog("1. Sync: Code Started");

            // Macrotask (runs last)
            setTimeout(function() {
                addLog("4. Macrotask: setTimeout finished");
            }, 0);

            // Microtask (runs after sync code)
            Promise.resolve().then(function() {
                addLog("3. Microtask: Promise finished");
            });

            addLog("2. Sync: Fetching from API...");

            try {
                var apiKey = "919d271dac1bb5318b47f53499249864";
                var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + apiKey;
                
                // Using await for fetch
                var response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error("City not found");
                }

                var data = await response.json();

                // Updating UI with results
                infoDiv.innerHTML = `
                    <div class="row"><b>City</b> <span>${data.name}</span></div>
                    <div class="row"><b>Temp</b> <span>${data.main.temp}°C</span></div>
                    <div class="row"><b>Humidity</b> <span>${data.main.humidity}%</span></div>
                    <div class="row"><b>Wind Speed</b> <span>${data.wind.speed} m/s</span></div>
                `;

                saveHistory(data.name);
                addLog("5. Async: Weather data loaded");

            } catch (err) {
                infoDiv.innerHTML = "<p style='color:red; text-align:center;'>Error: " + err.message + "</p>";
                addLog("Error occurred: " + err.message);
            }
        }

        // Function to save cities to Local Storage
        function saveHistory(cityName) {
            var history = JSON.parse(localStorage.getItem('myHistory')) || [];
            
            // If city is not in list, add it
            if (history.indexOf(cityName) === -1) {
                history.push(cityName);
                localStorage.setItem('myHistory', JSON.stringify(history));
                showHistory();
            }
        }

        // Function to show history buttons
        function showHistory() {
            var history = JSON.parse(localStorage.getItem('myHistory')) || ["Delhi", "Mumbai", "London"];
            var historyList = document.getElementById('historyList');
            historyList.innerHTML = "";

            // Standard for loop to create buttons
            for (var i = 0; i < history.length; i++) {
                var btn = document.createElement('button');
                btn.className = "hist-btn";
                btn.innerText = history[i];
                
                // Set click for each button
                let currentCity = history[i];
                btn.onclick = function() {
                    getWeatherData(currentCity);
                };
                historyList.appendChild(btn);
            }
        }

        // Event listener for the Search button
        document.getElementById('searchBtn').onclick = function() {
            var inputVal = document.getElementById('cityInput').value;
            getWeatherData(inputVal);
        };

        // Load history when page opens
        window.onload = showHistory;
