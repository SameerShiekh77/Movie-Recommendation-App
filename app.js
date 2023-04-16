const genre = document.getElementById("genre");
const rating = document.getElementById("rating");
const releaseYear = document.getElementById("release-year");
const language = document.getElementById("language");
let movieList = document.getElementById("display-movies");
const element = document.getElementById("table");

const genresArr = [];
let ratingArr = [];
let yearArray = [];
let languageArr = []
var uniqueGenresArray = [];
var uniqueRatingArray = [];
var uniqueYearArray = [];
var uniqueLanguagesArray = [];



// fetch all records in data.json of genres and rating and push them only unique values into an array 

function addOnlyUnique(array, uniqueAray) {
    for (let index in array) {
        let value = array[index];
        if (!Array.isArray(value)) {
            if (!uniqueAray.includes(value)) {
                uniqueAray.push(value);
            }
        } else {
            value.forEach(item => {
                if (!uniqueAray.includes(item)) {
                    uniqueAray.push(item);
                }
            });
        }
    }
}

// show options on html page 

function dynamicOptions(element, array) {
    for (let index = 0; index < array.length; index++) {
        element.innerHTML += `<option value="${array[index]}">${array[index]}</option>`;
    }
}


// fetch records from data.json
fetch('./data.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            genresArr.push(element.genres);
            ratingArr.push(element.vote_average)
            languageArr.push(element.original_language)
            let year = new Date(element.release_date).getFullYear()
            yearArray.push(year)
        });
        // Calling the function add only unique values to an array
        addOnlyUnique(genresArr, uniqueGenresArray);
        addOnlyUnique(ratingArr, uniqueRatingArray);
        addOnlyUnique(yearArray, uniqueYearArray);
        addOnlyUnique(languageArr, uniqueLanguagesArray);

        // Calling the function to show options on html page
        dynamicOptions(genre, uniqueGenresArray);
        dynamicOptions(rating, uniqueRatingArray);
        dynamicOptions(releaseYear, uniqueYearArray);
        dynamicOptions(language, uniqueLanguagesArray);

        localStorage.setItem('moviesList', JSON.stringify(data));
    })


// Load movie data from local storage
let getMovies = localStorage.getItem('moviesList')
let movies = JSON.parse(getMovies)

function getRecommendations() {

    let filteredMovies = filterMovies(movies, genre.value, rating.value, releaseYear.value, language.value);
    displayMovies(filteredMovies);


}
// Filter movies based on genre, rating, and release year
function filterMovies(movies, genre_value, rating, releaseYear, language) {
    let filteredMovies = movies.filter(movie => {

        if (movie.genres.toLocaleString().toLowerCase().includes(genre_value.toLowerCase()) || genre_value === "all") {
            if (movie.vote_average >= rating || rating === "all") {
                if (movie.release_date >= releaseYear || releaseYear === "all") {
                    if (movie.original_language === language || language === "all") {
                        return movie;
                    }

                }

            }

        }
    });
    return filteredMovies;
}


// Display recommended movies
function displayMovies(movies) {
    let response = movies
    movieList.innerHTML = "";

    if (response.length === 0) {

        movieList.innerHTML += "No Movie Found.";
        return;
    }
    response.forEach(movie => {
        let year = new Date(movie.release_date).getFullYear()
        let movieRecords = ` <tr>
        <td scope="row" class="align-middle text-center">${movie.id}</td>
        <td><div class="">
            <div class="row g-0">
              <div class="col-md-1">
                <img src="https://image.tmdb.org/t/p/w45/${movie.poster_path}" class="img-fluid rounded-start" alt="poster-image" style="height: 100px;">
              </div>
              <div class="col-md-11 d-flex justify-content-center align-items-center flex-wrap">
                <div class="card-body ">
                  <h5 class="card-title">${movie.title}</h5>
                  <p class="card-text"><span class="badge bg-info text-dark me-3">${movie.certification}</span><small class="text-muted">${movie.genres.toLocaleString()} ${movie.runtime} mints</small></strong></p>
                </div>
              </div>
            </div>
          </div></td>
        <td>${year}</td>
      </tr>`

        movieList.innerHTML += movieRecords;
        checkHeight();

    });
}
// Get user input from form

// repeat below code when user change any option
genre.addEventListener("change", event => {
    getRecommendations();

})

rating.addEventListener("change", event => {
    getRecommendations();

})
releaseYear.addEventListener("change", event => {
    getRecommendations();

})
language.addEventListener("change", event => {
    getRecommendations();

})

function checkHeight() {
    if (element.offsetHeight > '500') {
        element.style.height = "500px";
        element.style.overflowY = "scroll";
    }
    else {
        element.style.height = "auto";
        element.style.overflowY = "hidden";

    }
};