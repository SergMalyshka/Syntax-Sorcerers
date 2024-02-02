var stateSelectorEl = document.querySelector("#stateName")
var submitButton = document.querySelector("#submit-button")
var apiKey = 'QqdXFabPk82c8cfnPritbZ46DOJkuX1us430e5Qa'



function runApi() {
    var state = stateSelectorEl.value;
    fetch('https://developer.nps.gov/api/v1/parks?stateCode=' + state + '&api_key=' + apiKey, {
        headers: {
            'accept': 'application/json'
        }
    }).then(function (response) {
        if (response.ok) {
            return response.json();
        }
    }).then(function (data) {
        console.log(data);
    });
}

submitButton.addEventListener("click", function(event) {
    event.preventDefault();
    runApi();
})


