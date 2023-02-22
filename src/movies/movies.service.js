const knex = require("../db/connection")

const tableName = "movies"

function read(movieId){
    return knex("movies").select("*").where({ movie_id: movieId }).first()
}

function list(isShowing){
    if (isShowing === "true"){
        return listShowingMovies()
    }
    return listAllMovies()
}

function listAllMovies(){
    return knex("movies").select("*")
}

function listShowingMovies(){
    return knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .select("m.movie_id", "m.title", "m.runtime_in_minutes", "m.rating", "m.description", "m.image_url")
        .groupBy("m.movie_id")
        .where({is_showing: true})
}

function listTheatersByMovieId(movieId){
    return knex("theaters as t")
        .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
        .where({"mt.movie_id": movieId})
        .select("*")
}

function getCritic(criticId){
    return knex("critics")
    .select("*")
    .where({"critic_id":criticId})
}

function listReviewsByMovieId(movieId){
    return knex("reviews")
        .select("*")
        .where({"movie_id": movieId})
}

module.exports = {
    read,
    list,
    listTheatersByMovieId,
    getCritic,
    listReviewsByMovieId,
}