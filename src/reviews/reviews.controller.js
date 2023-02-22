const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reviewsService = require("./reviews.service")

async function reviewExists(req, res, next){
    const review = await reviewsService.read(req.params.reviewId)
    if (review){
        res.locals.review = review
        return next()
    }
    return next({
        status: 404,
        message: `Review cannot be found.`
    })
}

async function destroy(req, res, next){
    await reviewsService.destroy(req.params.reviewId)
    res.sendStatus(204)
}

function hasScoreAndBody(req, res, next){
    const { data: { score = null, content = null } = {} } = req.body
    let reviewContent = {}
    if (!score && !content){
        return next({
            status:400,
            message: "Score and content required to update review."
        })
    }
    if(score){
        reviewContent.score = score;
    }
    if (content) {
        reviewContent.content = content
    }
    res.locals.update = reviewContent
    next()
}

async function update(req, res){
    const { review } = res.locals
    const { update } = res.locals
    await reviewsService.update(update, review.review_id)
    const updatedReview = await reviewsService.read(review.review_id)
    const critic = await reviewsService.getCritic(review.critic_id)
    res.status(200).json({ data: { ... updatedReview, critic: critic[0]} })
}

module.exports = {
    delete: [reviewExists, asyncErrorBoundary(destroy)],
    update: [reviewExists, hasScoreAndBody, asyncErrorBoundary(update)]
}