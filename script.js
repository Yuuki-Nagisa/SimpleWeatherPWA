function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("WeatherDB", 1);

        request.onupgradeneeded = function (event) {
            let db = event.target.result;

            // ✅ Create object store if not exists
            if (!db.objectStoreNames.contains("weather")) {
                const store = db.createObjectStore("weather", { keyPath: "city_name" });
                store.createIndex("last_refresh_idx", "last_refresh", { unique: false });
            } else {
                const store = event.target.transaction.objectStore("weather");
                // ✅ Ensure index exists
                if (!store.indexNames.contains("last_refresh_idx")) {
                    store.createIndex("last_refresh_idx", "last_refresh", { unique: false });
                }
            }
        };

        request.onsuccess = function (event) {
            resolve(event.target.result);
        };

        request.onerror = function (event) {
            reject(event.target.error);
        };
    });
}



function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("WeatherDB", 1);

        request.onupgradeneeded = function (event) {
            let db = event.target.result;

            // ✅ Create object store if not exists
            if (!db.objectStoreNames.contains("weather")) {
                const store = db.createObjectStore("weather", { keyPath: "city_name" });
                store.createIndex("last_refresh_idx", "last_refresh", { unique: false });
            }
        };

        request.onsuccess = function (event) {
            resolve(event.target.result);
        };

        request.onerror = function (event) {
            reject(event.target.error);
        };
    });
}

// ✅ Save weather data to IndexedDB
function saveWeatherData(weatherData) {
    return openDB().then((db) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["weather"], "readwrite");
            const store = transaction.objectStore("weather");

            const request = store.put(weatherData);

            request.onsuccess = function () {
                console.log("✅ Weather data saved successfully:", weatherData);
                resolve();
            };

            request.onerror = function (event) {
                console.error("❌ Error saving weather data:", event.target.error);
                reject(event.target.error);
            };
        });
    }).catch(error => {
        console.error("❌ Database open error:", error);
    });
}

// ✅ Retrieve weather data from IndexedDB
function getWeatherData(city) {
    return openDB().then((db) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["weather"], "readonly");
            const store = transaction.objectStore("weather");

            const request = store.get(city);

            request.onsuccess = function () {
                if (request.result) {
                    console.log("✅ Weather data found:", request.result);
                    resolve(request.result);
                } else {
                    console.log("⚠️ No data found for", city);
                    resolve(null);
                }
            };

            request.onerror = function (event) {
                console.error("❌ Error retrieving data:", event.target.error);
                reject(event.target.error);
            };
        });
    });
}

// ✅ Delete weather data from IndexedDB
function deleteWeatherData(city) {
    return openDB().then((db) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["weather"], "readwrite");
            const store = transaction.objectStore("weather");

            const request = store.delete(city);

            request.onsuccess = function () {
                console.log("✅ Data deleted for:", city);
                resolve();
            };

            request.onerror = function (event) {
                console.error("❌ Error deleting data:", event.target.error);
                reject(event.target.error);
            };
        });
    });
}

// ✅ Retrieve the last saved city from IndexedDB
function getLastSavedCity() {
    return openDB().then((db) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["weather"], "readonly");
            const store = transaction.objectStore("weather");

            // ✅ Check if index exists before using it
            if (!store.indexNames.contains("last_refresh_idx")) {
                console.error("❌ Index 'last_refresh_idx' not found!");
                resolve(null);
                return;
            }

            const index = store.index("last_refresh_idx");
            const request = index.openCursor(null, "prev"); // Fetch latest entry

            request.onsuccess = function () {
                const cursor = request.result;
                if (cursor) {
                    console.log("✅ Last saved city data:", cursor.value);
                    resolve(cursor.value);
                } else {
                    console.log("⚠️ No weather data found.");
                    resolve(null);
                }
            };

            request.onerror = function (event) {
                console.error("❌ Error retrieving last saved city:", event.target.error);
                reject(event.target.error);
            };
        });
    });
}

function getWeatherData(city) {
    const transaction = db.transaction(["weather"], "readonly");
    const store = transaction.objectStore("weather");

    const request = store.get(city);

    request.onsuccess = function () {
        if (request.result) {
            console.log("Weather data:", request.result);
        } else {
            console.log("No data found for", city);
        }
    };

    request.onerror = function (event) {
        console.error("Error retrieving data:", event.target.error);
    };
}

function deleteWeatherData(city) {
    const transaction = db.transaction(["weather"], "readwrite");
    const store = transaction.objectStore("weather");

    const request = store.delete(city);

    request.onsuccess = function () {
        console.log("Data deleted for:", city);
    };

    request.onerror = function (event) {
        console.error("Error deleting data:", event.target.error);
    };
}

function getAllWeatherData() {
    const transaction = db.transaction(["weather"], "readonly");
    const store = transaction.objectStore("weather");

    const request = store.getAll();

    request.onsuccess = function () {
        console.log("All weather data:", request.result);
    };

    request.onerror = function (event) {
        console.error("Error retrieving all data:", event.target.error);
    };
}

function getLastSavedCity() {
    return openDB().then((db) => {
        const transaction = db.transaction(["weather"], "readonly");
        const store = transaction.objectStore("weather");

        // ✅ Check if index exists before using it
        if (!store.indexNames.contains("last_refresh_idx")) {
            console.error("Index 'last_refresh_idx' not found!");
            return Promise.resolve(null);
        }

        const index = store.index("last_refresh_idx");

        return new Promise((resolve, reject) => {
            const request = index.openCursor(null, "prev"); // Fetch latest entry

            request.onsuccess = function () {
                const cursor = request.result;
                if (cursor) {
                    console.log("Last saved city data:", cursor.value);
                    resolve(cursor.value);
                } else {
                    console.log("No weather data found.");
                    resolve(null);
                }
            };

            request.onerror = function (event) {
                console.error("Error retrieving last saved city:", event.target.error);
                reject(event.target.error);
            };
        });
    });
}



async function Refresh() {
    const cityData = await getLastSavedCity(); // Wait for city data
    const city = cityData ? cityData.city_name : "delhi";

    console.log("Fetching weather for:", city);

    getWeather(city).then(() => {
        setTimeout(() => {
            homeFunc(); // ✅ Reload after 1 seconds
        }, 1000);
    }).catch(error => {
        console.error("Error fetching weather:", error);
    });
}

function formatDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString("en-GB"); // "DD/MM/YYYY"
    const time = now.toLocaleTimeString("en-GB"); // "HH:MM:SS"
    return `${date} ${time}`;
}   
async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=60e5d1f3111ee7f676d378e40e7def8c
&units=metric`;
    console.log(url);

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === 200) {
            const weatherData = {
                city_name: city.toLowerCase(),
                country:data.sys.country,
                temperature: data.main.temp,
                condition: data.weather[0].description,
                wind_speed: data.wind.speed,
                last_refresh:formatDateTime()
            };
            console.log("Saving weather data:", weatherData);
            saveWeatherData(weatherData);
            
            document.getElementById("mainData").innerHTML = `
                <p>🌍 Location: ${data.name}, ${data.sys.country}</p>
                <p>🌡️ Temperature: ${data.main.temp}°C</p>
                <p>☁️ Condition: ${data.weather[0].description}</p>
                <p>💨 Wind Speed: ${data.wind.speed} m/s</p>
                <p>Last Refresh: ${weatherData.last_refresh} </p>
                
            `;
        } else {
            document.getElementById("mainData").innerHTML = `<p style="color:red;">⚠️ ${data.message}</p>`;
        }
    } catch (error) {
        document.getElementById("mainData").innerHTML = `<p style="color:red;">⚠️ Unable to fetch data.</p>`;
    }
}
function locationFunc() {
    document.getElementById("mainData").innerHTML = `
        <h3>🌍 Enter Your City</h3>
        <input type="text" id="cityInput" placeholder="Enter city name" />
        <button onclick="setCity()" id="setButton">Set</button>
    `;
}

function setCity() {
    let city = document.getElementById("cityInput").value.trim();
    getLastSavedCity().then((cityData) => {
        if (cityData) {
            deleteWeatherData(cityData.city_name);
            getWeather(city);
        } 
    }).catch((error) => {
        console.error("Error retrieving last saved city:", error);
        getWeather(city);
    });
}

openDB();
function homeFunc(){
    getLastSavedCity().then((cityData) => {
        if (cityData) {
            document.getElementById("mainData").innerHTML = `
                    <p>🌍 Location: ${cityData.city_name}, ${cityData.country}</p>
                    <p>🌡️ Temperature: ${cityData.temperature}°C</p>
                    <p>☁️ Condition: ${cityData.condition}</p>
                    <p>💨 Wind Speed: ${cityData.wind_speed} m/s</p>
                    <p>Last Refresh: ${cityData.last_refresh} </p>
                    
                `;
        } else {
            city = "delhi";
        }
    }).catch((error) => {
        console.error("Error retrieving last saved city:", error);
        city = "delhi";  // Fallback to default if error occurs
        getWeather(city);
    });
}

homeFunc();

if ("serviceWorker" in navigator){
    navigator.serviceWorker.register("sw.js").then(registration =>{
        console.log("SW Registered!!", registration);
    }).catch(error =>{
        console.log("SW Registration fails....",error);
    });
}
