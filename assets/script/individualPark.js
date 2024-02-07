var campgroundEl = document.querySelector("#campgrounds-tab")
var activitesEl = document.querySelector("#activities-tab")
var picturesEl = document.querySelector("#pictures-tab")
var tabElements = [campgroundEl, activitesEl, picturesEl];
var campgroundContainerEl = document.querySelector("#campground-container")
var miscalleneousContainerEl = document.querySelector("#miscalleneous-container")
var picturesContainerEl = document.querySelector("#pictures-container")
var containerElements = [campgroundContainerEl, miscalleneousContainerEl, picturesContainerEl]
var descriptionEl = document.querySelector("#description")
var previewImgEl = document.querySelector("#preview-img")
var parkHeaderEl = document.querySelector("#park-header")
var mapEl = document.querySelector("#map")
var slideshowDescription = document.querySelector("#slideshow-image-description")
var activitiesInfo = document.querySelector("#activities-info")
var directionsInfo = document.querySelector("#directions-info")
var directionsLink = document.querySelector("#directions-link")
var weatherInfo = document.querySelector("#weather-info")
var favoriteButton = document.querySelector("#favorite-button")
var slideshow = document.querySelector("#slideshow")
var heartEl = document.querySelector("#heart")
var favoriteTextEl = document.querySelector("#favorite-text")
var campgrounds = [];
var favourites = [];
let map;
var parkName;
var parkLat;
var parkLon;

//query parameter sent from front page
let params = new URL(document.location).searchParams;
let parkCode = params.get("parkCode");

//close all three tabs at page load, right before opening a new tab
function closeTabs() {
    for (var i = 0; i < tabElements.length; i++) {
        tabElements[i].className = "";
        containerElements[i].setAttribute("style", "display:none")
    }
}

//event listeners on each tab button to make it active when clicked
for (var i = 0; i < tabElements.length; i++) {
    let j = i;
    tabElements[i].addEventListener("click", function (event) {
        closeTabs();
        tabElements[j].classList.add("is-active")
        containerElements[j].setAttribute("style", "display:block")
        event.target.scrollIntoView();
    })
}


//main api call
function runApi() {
    fetch("https://developer.nps.gov/api/v1/parks?parkCode=" + parkCode + "&api_key=QqdXFabPk82c8cfnPritbZ46DOJkuX1us430e5Qa", {
        headers: {
            'accept': 'application/json'
        }
    }).then(function (response) {
        if (response.ok) {
            return response.json();
        }
    }).then(function (parkData) {
        //populate the header with park name
        parkHeaderEl.textContent = parkData.data[0].fullName

        parkName = parkData.data[0].name

        //check if park is favorited, style button apropriately 
        checkStorage();

        //setting image and description
        descriptionEl.textContent = parkData.data[0].description;
        previewImgEl.setAttribute("src", parkData.data[0].images[0].url)


        //initialize map and get campgrounds
        centerMap(parkData.data[0])
        getCampgrounds();


        //populate image slideshow with img URLs
        populateSlideShow(parkData.data[0].images)
        //same for activities
        populateActivities(parkData.data[0].activities)
        //and directions
        directionsInfo.textContent = parkData.data[0].directionsInfo
        //link for NPS directions page
        directionsLink.setAttribute("href", parkData.data[0].directionsUrl)
        directionsLink.setAttribute("target", "_blank")

        //and weahter
        weatherInfo.textContent = parkData.data[0].weatherInfo
    });
}

//get campgrounds for this park
function getCampgrounds() {
    fetch("https://developer.nps.gov/api/v1/campgrounds?parkCode=" + parkCode + "&api_key=QqdXFabPk82c8cfnPritbZ46DOJkuX1us430e5Qa", {
        headers: {
            'accept': 'application/json'
        }
    }).then(function (response) {
        if (response.ok) {
            return response.json();
        }
    }).then(function (mapData) {
        //cycle through map coordinates and drop a pin for each one
        for (var i = 0; i < mapData.data.length; i++) {
            var center = new google.maps.LatLng(mapData.data[i].latitude, mapData.data[i].longitude)
            var marker = new google.maps.Marker({
                map: map,
                position: center
            })
        }
    });
}

//centers rendered map on the park coordinates
function centerMap(data) {
    var center = new google.maps.LatLng(data.latitude, data.longitude)
    map.setCenter(center)
    var marker = new google.maps.Marker({
        map: map,
        position: center
    });
}

//creating the image slideshow
function populateSlideShow(data) {
    for (var i = 0; i < data.length; i++) {

        //create the image element with URL and alt
        var slideShowImg = document.createElement("img");
        slideShowImg.classList = "d-block w-100"
        slideShowImg.src = data[i].url
        slideShowImg.alt = data[i].caption
        slideShowImg.id = "slideshow-img"


        //first image is active
        var imgContainer = document.createElement("div")
        if (i === 0) {
            imgContainer.classList = "carousel-item active"
        } else (
            imgContainer.classList = "carousel-item"
        )

        //image description
        var imgDescription = document.createElement("h3")
        imgDescription.textContent = data[i].caption

        //appending everything up the lineage tree
        imgContainer.appendChild(imgDescription)
        imgContainer.appendChild(slideShowImg);
        slideshow.appendChild(imgContainer);
    }
}

// populate activities 
function populateActivities(data) {

    for (var i = 0; i < data.length; i++) {
        var individualActivity = document.createElement("span")
        individualActivity.classList = "tag is-info is-rounded is-medium is-light individual-activities"
        individualActivity.textContent = data[i].name
        activitiesInfo.appendChild(individualActivity)
    }

}

//initialize the map as per google docs
function initMap() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(-34.397, 150.644);
    var mapOptions = {
        zoom: 10,
        center: latlng
    }

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

//dynamically check to see if park is already favourited or not on page load
function checkStorage() {
    heartEl.classList = "fa-regular fa-heart"
    favoriteTextEl.textContent = "Favorite"
    favourites = JSON.parse(localStorage.getItem("favourites"))
    if (favourites !== null) {
        for (var i = 0; i < favourites.length; i++) {
            if (favourites[i].name === parkName) {
                //if local storage contains our park, set styling for the button to filled in heart and text
                heartEl.classList = "fa-solid fa-heart"
                favoriteTextEl.textContent = "Already Favorited"
            }
        }
    }
}

//adds item to favorite - local storage
function addToLocalStorage(favourites, data) {
    favourites.push(data);
    localStorage.setItem("favourites", JSON.stringify(favourites))
    checkStorage()
}

//event listener for favorite button to dynamically change between favorited or not based on local storage 
favoriteButton.addEventListener("click", function () {
    favourites = JSON.parse(localStorage.getItem("favourites"))

    //initialize the item to store
    var location = {
        name: parkName,
        code: parkCode
    }
    //if already favourited, loop through the items, find it, and remove it, call check storage to update button properly
    if (favoriteTextEl.textContent === "Already Favorited") {
        for (var i = 0; i < favourites.length; i++) {
            if (favourites[i].name === parkName) {
                favourites.splice(i, 1);
                localStorage.setItem("favourites", JSON.stringify(favourites))
                checkStorage()
            }
        }
        //if its not in the storage and storage is null initialize it, and add to local storage
    } else if (favourites === null) {
        favourites = [];
        addToLocalStorage(favourites, location)

        //otherwise just add to local storage
    } else {
        addToLocalStorage(favourites, location)
    }
    //update button appearance based on whichever action took place
    checkStorage()
})

closeTabs();
window.initMap = initMap;
runApi();