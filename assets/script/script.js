document.addEventListener('DOMContentLoaded', function () {
    var stateSelectorEl = document.querySelector("#stateName");
    var submitButton = document.querySelector("#submit-button");
    var servicesContainer = document.querySelector(".services-container");
    var apiKey = 'QqdXFabPk82c8cfnPritbZ46DOJkuX1us430e5Qa';
    var parksContainerEl = document.querySelector("#parks-container")
    var deleteButton = document.querySelector("#delete")
    var favoritesEl = document.querySelector("#favorites")
    var stateList = ["al", "ak", "az", "ar", "ca", "co", "ct", "de", "dc", "fl", "ga", "gu", "hi", "id", "il", "in", "ia",
        "ks", "ky", "la", "me", "md", "ma", "mi", "mn", "ms", "mo", "mt", "ne", "nv", "nh", "nj", "nm", "ny", "nc", "nd", "oh", "ok",
        "or", "pa", "pr", "ri", "sc", "sd", "tn", "tx", "ut", "vt", "vi", "va", "wa", "wv", "wi", "wy"]


    //API call based on user input
    function runApi() {
        var state = stateSelectorEl.value;
        fetch('https://developer.nps.gov/api/v1/parks?stateCode=' + state + '&api_key=' + apiKey, {
            headers: {
                'accept': 'application/json'
            }
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(function (data) {
                // Clear existing cards
                servicesContainer.innerHTML = '';

                // Iterate through data to create cards
                data.data.forEach(function (park) {
                    var parkCode = park.parkCode
                    var anchor = document.createElement("a")

                    anchor.setAttribute("href", "./individualPark.html?parkCode=" + parkCode)
                    var card = document.createElement("div");
                    card.className = "card";

                    var cardTitle = document.createElement("h3");
                    cardTitle.textContent = park.fullName; // Example: park name

                    var cardDescription = document.createElement("p");
                    cardDescription.id = "card-description"
                    cardDescription.textContent = park.description; // Example: park description

                    card.appendChild(cardTitle);
                    card.appendChild(cardDescription);
                    anchor.appendChild(card)

                    servicesContainer.appendChild(anchor);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    //populate and display the favorites on the front page
    function populateFavorites() {
        var favorites = JSON.parse(localStorage.getItem("favourites"))
        //if they are not null, perform for each
        if (favorites !== null) {
            for (var j = 0; j < favorites.length; j++) {

                //create the span for park name
                var favoriteDiv = document.createElement("div")
                favoriteDiv.classList = "tags has-addons"
                var favoriteSpan = document.createElement("span")
                var deleteButton = document.createElement("a")
                favoriteSpan.classList = "tag is-info is-medium favorite-tags"
                favoriteSpan.id = favorites[j].code

                //create the delete button
                favoriteSpan.textContent = favorites[j].name
                deleteButton.classList = "tag is-delete is-medium"
                favoriteDiv.appendChild(favoriteSpan)
                favoriteDiv.appendChild(deleteButton)
                favoritesEl.appendChild(favoriteDiv)

                //event listener on each delete button to remove from favorites 
                deleteButton.addEventListener("click", function (event) {
                    for (var i = 0; i < favorites.length; i++) {
                        if (favorites[i].name === event.target.parentElement.textContent) {
                            console.log("is there")
                            favorites.splice(i, 1);
                            localStorage.setItem("favourites", JSON.stringify(favorites))
                            event.target.parentElement.setAttribute("style", "display:none")
                        }
                    }
                })

                //event listener on each span to be re-directed to the individual park page
                favoriteSpan.addEventListener("click", function (event) {
                    console.log(event.target.id)
                    document.location = "./individualPark.html?parkCode=" + event.target.id
                })
            }
        }
    }

    //event listener on main search button
    submitButton.addEventListener("click", function (event) {
        event.preventDefault();
        var state = stateSelectorEl.value.toLowerCase();
        //input validation to ensure proper input
        if (stateList.indexOf(state) >= 0) {
            parksContainerEl.setAttribute("style", "display: block")
            runApi();
        } 
    });
    //dispaly favorites on page load
    populateFavorites();
});
