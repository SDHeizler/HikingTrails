'use strict'
$(beginScreen())
console.log('App loaded')
function beginScreen() {
    $('#js-button').on('click', function () {
        $('.about').hide(300);
        $('#js-hidden').show(300);
        $(getUserInfo());
    })
}
// Get info from user input
function getUserInfo() {
    $('.infoForm').on('submit', function (event) {
        event.preventDefault();
        const userAddress = $('#js-address').val();
        const userState = $('#js-state').val();
        const userCity = $('#js-city').val();
        const userDistance = $('#js-distance').val();
        $(getLatLong(userAddress, userState, userCity, userDistance));
        $('#js-list').empty();
        $('.infoForm').find('#button').attr('value', 'Search Again');
    })
}
// Convert user address to lat. and long.
function getLatLong(userAddress, userState, userCity, userDistance) {
    let addressArray = [];
    let newArray = [];
    for (let i = 0; i < 1; i++) {
        addressArray.push(userAddress);
    }
    fetch(`https://eec19846-geocoder-us-census-bureau-v1.p.rapidapi.com/locations/onelineaddress?format=json&address=${addressArray}%20${userCity}%20${userState}&benchmark=Public_AR_Current`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "eec19846-geocoder-us-census-bureau-v1.p.rapidapi.com",
            "x-rapidapi-key": "fd6749471fmshc55581fb6dedbe7p145871jsn00d49591cf6a"
        }
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.statusText);
            }

        })
        .then(function (responseJson) {
            getCoordinates(responseJson, userDistance);
        })
        .catch(function (err) {
            console.log(err.message);
            $('.infoForm').hide(300);
            $('#errorContainer').show(300);
            $('#errorContainer').delay(3000).hide(300, function () {
                $('.infoForm').show(300);
            });
            $('#js-address').val("");
            $('#js-state').val("");
            $('#js-city').val("");
            $('#js-distance').val('10');
        })
}

function getCoordinates(responseJson, userDistance) {
    console.log(responseJson)
    responseJson.result.addressMatches.map(function (ele) {
        const coordinates = ele.coordinates;
        getHikingTrails(coordinates, userDistance);
    })
}
// Get list of hiking trails
function getHikingTrails(coordinates, userDistance) {
    const userLon = coordinates.x;
    const userLat = coordinates.y;
    const url = `https://www.trailrunproject.com/data/get-trails?lat=${userLat}&lon=${userLon}&maxDistance=${userDistance}&key=200637152-6e5f9174b35a974329f2aac12a725d73`;
    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.statusText);
            }
        })
        .then(function (responseJson) {
            console.log(responseJson);
            displayHikingTrails(responseJson);
        })
        .catch(function (err) {
            console.log(err.message);
            $('.infoForm').hide(300);
            $('#errorContainer').show(300);
            $('#errorContainer').delay(3000).hide(300, function () {
                $('.infoForm').show(300);
            });
            $('#js-address').val("");
            $('#js-state').val("");
            $('#js-city').val("");
            $('#js-distance').val('10');
        })
}
// Display list of hiking trails
function displayHikingTrails(responseJson) {
    const trails = responseJson.trails;
    trails.map(function (ele) {
        $('#js-list').append(`<li><h2>${ele.name}</h2>
        <img src="${ele.imgSmall}" alt="No Image">
                <p>${ele.summary}</p>
            <a href="${ele.url}" target="_blank">${ele.name} :Website</a></li>`)
    })
    $('#js-address').val("");
    $('#js-state').val("");
    $('#js-city').val("");
    $('#js-distance').val('10');
}
