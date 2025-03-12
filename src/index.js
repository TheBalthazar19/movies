"use strict";
class Movie {
    id;
    title;
    director;
    releaseYear;
    genre;
    ratings;
    constructor(id, title, director, releaseYear, genre) {
        this.id = id;
        this.title = title;
        this.director = director;
        this.releaseYear = releaseYear;
        this.genre = genre;
        this.ratings = [];
    }
    addRating(rating) {
        if (rating < 1 || rating > 5) {
            throw new Error("Rating must be between 1 and 5.");
        }
        this.ratings.push(rating);
    }
    getAverageRating() {
        if (this.ratings.length === 0)
            return undefined;
        return this.ratings.reduce((sum, rating) => sum + rating, 0) / this.ratings.length;
    }
}
class MovieDatabase {
    movies;
    constructor() {
        this.movies = new Map();
    }
    addMovie(id, title, director, releaseYear, genre) {
        if (this.movies.has(id)) {
            throw new Error("Movie with this ID already exists.");
        }
        const movie = new Movie(id, title, director, releaseYear, genre);
        this.movies.set(id, movie);
    }
    rateMovie(id, rating) {
        const movie = this.movies.get(id);
        if (!movie) {
            throw new Error("Movie not found.");
        }
        movie.addRating(rating);
    }
    getAverageRating(id) {
        const movie = this.movies.get(id);
        return movie?.getAverageRating();
    }
    getTopRatedMovies() {
        return Array.from(this.movies.values())
            .filter(movie => movie.ratings.length > 0)
            .sort((a, b) => (b.getAverageRating() ?? 0) - (a.getAverageRating() ?? 0));
    }
    getMoviesByGenre(genre) {
        return Array.from(this.movies.values()).filter(movie => movie.genre.toLowerCase() === genre.toLowerCase());
    }
    getMoviesByDirector(director) {
        return Array.from(this.movies.values()).filter(movie => movie.director.toLowerCase() === director.toLowerCase());
    }
    searchMoviesBasedOnKeyword(keyword) {
        return Array.from(this.movies.values()).filter(movie => movie.title.toLowerCase().includes(keyword.toLowerCase()));
    }
    getMovie(id) {
        return this.movies.get(id);
    }
    removeMovie(id) {
        return this.movies.delete(id);
    }
}
// Example Usage
const movieDB = new MovieDatabase();
movieDB.addMovie("1", "Inception", "Christopher Nolan", 2010, "Sci-Fi");
movieDB.addMovie("2", "Interstellar", "Christopher Nolan", 2014, "Sci-Fi");
movieDB.addMovie("3", "The Dark Knight", "Christopher Nolan", 2008, "Action");
movieDB.rateMovie("1", 5);
movieDB.rateMovie("1", 4);
movieDB.rateMovie("2", 5);
movieDB.rateMovie("3", 4);
console.log("All Movies:", movieDB.getTopRatedMovies());
console.log("Movies by Genre (Sci-Fi):", movieDB.getMoviesByGenre("Sci-Fi"));
console.log("Movies by Director (Christopher Nolan):", movieDB.getMoviesByDirector("Christopher Nolan"));
console.log("Search for 'Inter':", movieDB.searchMoviesBasedOnKeyword("Inter"));
console.log("Movie with ID '1':", movieDB.getMovie("1"));
console.log("Removing Movie ID '3':", movieDB.removeMovie("3"));
console.log("All Movies after removal:", movieDB.getTopRatedMovies());
