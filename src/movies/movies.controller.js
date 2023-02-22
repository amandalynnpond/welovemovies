const moviesService = require("./movies.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

async function movieExists(req, res, next){
    const movie = await moviesService.read(req.params.movieId)
    if (movie){
        res.locals.movie = movie
        return next()
    }
    return next({
        status: 404,
        message: `Movie id ${req.params.movieId} does not exist.`
    })
}

async function read(req, res, next){
    res.json({ data: res.locals.movie })
}

async function list(req, res, next){
    const data = await moviesService.list(req.query.is_showing)
    res.json({data})
}

async function listTheatersByMovieId(req, res, next){
    const data = await moviesService.listTheatersByMovieId(req.params.movieId)
    res.json({data})
}

async function listReviewsByMovieId(req, res) {
    const { movieId } = req.params
    const reviews = await moviesService.listReviewsByMovieId(movieId);
    const allReviews = [];
    for (let i = 0; i < reviews.length; i++) {
      const review = reviews[i];
      const critic = await moviesService.getCritic(review.critic_id);
      review.critic = critic[0]
      allReviews.push(review)
    }
    res.status(200).json({data: allReviews})
  }

module.exports = {
    read: [movieExists, read],
    list: asyncErrorBoundary(list),
    listTheatersByMovieId: [movieExists, asyncErrorBoundary(listTheatersByMovieId)],
    listReviewsByMovieId: [movieExists, asyncErrorBoundary(listReviewsByMovieId)]
}