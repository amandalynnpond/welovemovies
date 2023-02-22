const knex = require("../db/connection")

function read(reviewId){
    return knex("reviews")
        .select("*")
        .where({"review_id": reviewId})
        .first()
}

function destroy(reviewId){
    return knex("reviews")
    .select("*")
    .where({"review_id": reviewId})
    .del()
}

function update(updatedReview, reviewId){
    return knex("reviews")
    .select("*")
    .where({ review_id: reviewId })
    .update({...updatedReview} )
}

function getCritic(criticId) {
    return knex("critics")
        .select("*")
        .where({ critic_id: criticId })
}

module.exports = {
    read,
    destroy,
    update,
    getCritic
}