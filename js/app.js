
const urlCities = "https://gist.githubusercontent.com/alex-oleshkevich/6946d85bf075a6049027306538629794/raw/3986e8e1ade2d4e1186f8fee719960de32ac6955/by-cities.json";


const httpGetCities = (urlCities) => {
    return new Promise(function (resolve, reject) {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', urlCities, true);
        xhr.overrideMimeType("application/json");

        xhr.onload = function () {
            if (this.status == 200) {
                resolve(this.response);
            } else {
                var error = new Error(this.statusText);
                error.code = this.status;
                reject(error);
            }
        };

        xhr.onerror = function () {
            reject(new Error("Network Error"));
        };
        xhr.send();
    });
}

const showCities = citiesData => {
    let data = JSON.parse(citiesData);
    let regions = data[0].regions;
    let sel = document.getElementById("cities");
    for (let j = 0; j < regions.length; j++) {

        let city = regions[j].cities;
        for (let i = 0; i < city.length; i++) {
            let name = city[i].name;
            let val = city[i].lat;
            let opt = `<option val="${val}">${name}</option>`
            sel.innerHTML += opt;
        }
    }
}

function getWeather(city) {
    let urlWeather = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=300b07d359c3f75b13f6e6a6578ad94c`;
    fetch(urlWeather)
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }
                return response.json();
            }
        )
        .then(showWeather)
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

function showWeather(response) {
    console.log(response);
    let weatherTable = document.getElementById("weatherTable");
    weatherTable.classList.add("active");
    // let dataString = JSON.stringify(response);
    var now = new Date();
    let h = now.getHours();
    var num = (Math.floor(h / 3));
    //сегодня
    document.getElementById("time1").innerHTML = response.list[num].dt_txt;
    document.getElementById("temp1").innerHTML = "Температура: " + " " + Math.floor((response.list[num].main["temp"]) - 273, 15) + "°C";
    document.getElementById("wind1").innerHTML = "Скорость ветра: " + " " + response.list[num].wind["speed"] + "м/с";
    var imgURL = "https://openweathermap.org/img/w/" + response.list[num].weather[0].icon + ".png";
    document.getElementById("pic1").setAttribute("src", imgURL);
    //завтра
    document.getElementById("time2").innerHTML = response.list[num + 8].dt_txt;
    document.getElementById("temp2").innerHTML = "Температура: " + " " + Math.floor((response.list[num + 8].main["temp"]) - 273, 15) + "°C";
    document.getElementById("wind2").innerHTML = "Скорость ветра: " + " " + response.list[num + 8].wind["speed"] + "м/с";
    var imgURL = "https://openweathermap.org/img/w/" + response.list[num + 8].weather[0].icon + ".png";
    document.getElementById("pic2").setAttribute("src", imgURL);
    //послезавтра
    document.getElementById("time3").innerHTML = response.list[num + 16].dt_txt;
    document.getElementById("temp3").innerHTML = "Температура: " + " " + Math.floor((response.list[num + 16].main["temp"]) - 273, 15) + "°C";
    document.getElementById("wind3").innerHTML = "Скорость ветра: " + " " + response.list[num + 16].wind["speed"] + "м/с";
    var imgURL = "https://openweathermap.org/img/w/" + response.list[num + 16].weather[0].icon + ".png";
    document.getElementById("pic3").setAttribute("src", imgURL);
}


let promise = httpGetCities(urlCities);
promise.then(
    result => {
        showCities(result);
    },
    error => {
        console.log("Rejected: " + error);
    }
);

let cities = document.querySelector("#cities");
cities.addEventListener("change", function () {
    console.log(this.value);
    document.getElementById("nameCity").innerHTML = `Погода в городе ${this.value}`;
    getWeather(this.value);
}); 