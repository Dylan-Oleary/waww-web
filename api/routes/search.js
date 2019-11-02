const router = require("express").Router();
const tmdb = require('./apis/tmdb');

router.route("/")
    .get((request, response) => {
        tmdb.get("search/movie", {
            params: {
                api_key: process.env.TMDB_KEY,
                language: "en-US",
                query: request.query.searchTerm,
                page: request.query.page,
                include_adult: false
            }
        }).then(results => {
            response.send({
                currentSearch: request.query.searchTerm,
                searchResults: results.data.results,
                currentPage: results.data.page,
                totalPages: results.data.total_pages,
                totalResults: results.data.total_results
            });
        }).catch(() => {
            response.status(502).send({ message: "Woops! Something went wrong on our end! Please try again" });
        });
    })
; // close router.route("/")

module.exports = router;