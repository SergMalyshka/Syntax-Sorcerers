var campgroundEl = document.querySelector("#campgrounds-tab")
var activitesEl = document.querySelector("#activities-tab")
var picturesEl = document.querySelector("#pictures-tab")
var tabElements = [campgroundEl, activitesEl, picturesEl];
var campgroundContainerEl = document.querySelector("#campground-container")
var activitiesContainerEl = document.querySelector("#activities-container")
var picturesContainerEl = document.querySelector("#pictures-container")
var containerElements = [campgroundContainerEl, activitiesContainerEl, picturesContainerEl]
var descriptionEl = document.querySelector("#description")
var previewImgEl = document.querySelector("#preview-img")
var parkHeaderEl = document.querySelector("#park-header")
var mapEl = document.querySelector("#map")
var campgrounds = [];
let map;
var address;
var geocoder;

function closeTabs() {
    for (var i = 0; i < tabElements.length; i++) {
        tabElements[i].className = "";
        containerElements[i].setAttribute("style", "display:none")
    }
}

for (var i = 0; i < tabElements.length; i++) {
    let j = i;
    tabElements[i].addEventListener("click", function (event) {
        closeTabs();
        console.log(event.target)
        tabElements[j].classList.add("is-active")
        containerElements[j].setAttribute("style", "display:block")
        event.target.scrollIntoView();
    })
}

function runApi() {
    fetch("https://developer.nps.gov/api/v1/parks?parkCode=yose&api_key=QqdXFabPk82c8cfnPritbZ46DOJkuX1us430e5Qa", {
        headers: {
            'accept': 'application/json'
        }
    }).then(function (response) {
        if (response.ok) {
            return response.json();
        }
    }).then(function (data) {
        parkHeaderEl.textContent = data.data[0].name
        descriptionEl.textContent = data.data[0].description;
        previewImgEl.setAttribute("src", data.data[0].images[0].url)
        centerMap(data.data[0])
        getCampgrounds();
    });
}

function centerMap(data) {
    var center = new google.maps.LatLng(data.latitude, data.longitude)
    map.setCenter(center)
    var marker = new google.maps.Marker({
        map: map,
        position: center
    });
}

function getCampgrounds() {
    fetch("https://developer.nps.gov/api/v1/campgrounds?parkCode=yose&api_key=QqdXFabPk82c8cfnPritbZ46DOJkuX1us430e5Qa", {
        headers: {
            'accept': 'application/json'
        }
    }).then(function (response) {
        if (response.ok) {
            return response.json();
        }
    }).then(function (data) {
        for (var i = 0; i < data.data.length; i++) {
            var center = new google.maps.LatLng(data.data[i].latitude, data.data[i].longitude)
            var marker = new google.maps.Marker({
                map: map,
                position: center
            })
        }
    });
}

function initMap() {

    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var mapOptions = {
        zoom: 10,
        center: latlng
    }

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

window.initMap = initMap;
runApi();