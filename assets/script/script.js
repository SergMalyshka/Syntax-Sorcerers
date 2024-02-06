document.addEventListener('DOMContentLoaded', function() {
    var stateSelectorEl = document.querySelector("#stateName");
    var submitButton = document.querySelector("#submit-button");
    var servicesContainer = document.querySelector(".services-container");
    var apiKey = 'QqdXFabPk82c8cfnPritbZ46DOJkuX1us430e5Qa';
    var parksContainerEl = document.querySelector("#parks-container")
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
            data.data.forEach(function(park) {
                var parkCode = park.parkCode
                var anchor = document.createElement("a")

                anchor.setAttribute("href", "./individualPark.html?parkCode=" + parkCode)
                var card = document.createElement("div");
                card.className = "card";

                var cardTitle = document.createElement("h3");
                cardTitle.textContent = park.fullName; // Example: park name

                var cardDescription = document.createElement("p");
                cardDescription.textContent = park.description; // Example: park description

                card.appendChild(cardTitle);
                card.appendChild(cardDescription);
                anchor.appendChild(card)

                servicesContainer.appendChild(anchor);
            });
        })
        .catch(error => console.error('Error:', error));
    }

    submitButton.addEventListener("click", function(event) {
        event.preventDefault();
        parksContainerEl.setAttribute("style","display: block")
        runApi();
    });

    // Add navigation functionality
    
    // var leftArrow = document.createElement("button");
    // leftArrow.textContent = "←";
    // leftArrow.classList.add("arrow", "left-arrow");
    // servicesContainer.parentNode.insertBefore(leftArrow, servicesContainer);

    // var rightArrow = document.createElement("button");
    // rightArrow.textContent = "→";
    // rightArrow.classList.add("arrow", "right-arrow");
    // servicesContainer.parentNode.insertBefore(rightArrow, servicesContainer.nextSibling);

    // leftArrow.addEventListener("click", function() {
    //     servicesContainer.scrollBy({ left: -300, behavior: 'smooth' });
    // });

    // rightArrow.addEventListener("click", function() {
    //     servicesContainer.scrollBy({ left: 300, behavior: 'smooth' });
    // });
});
