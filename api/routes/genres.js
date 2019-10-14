const router = require("express").Router();
const tmdb = require('./apis/tmdb');
const { genres } = require('../constants');

router.route("/:id")
    .get((request, response) => {
        const { id } = request.params;
        const { primaryReleaseDateGTE, primaryReleaseDateLTE, certification, sortBy, page } = request.query;

        tmdb.get('/discover/movie', {
            params: {
                api_key: process.env.TMDB_KEY,
                language: "en-US",
                region: "US",
                sort_by: sortBy ? sortBy : 'vote_count.desc',
                include_adult: false,
                certification_country: "US",
                certification: certification ? certification : null,
                with_genres: id,
                page: page,
                'primary_release_date.gte': primaryReleaseDateGTE ? primaryReleaseDateGTE : null,
                'primary_release_date.lte': primaryReleaseDateLTE ? primaryReleaseDateLTE : null
            }
        }).then(tmdbResponse => {
            let genreName;

            for(let i = 0; i < genres.length; i++){
                if(id == genres[i].id){
                    genreName = genres[i].name;
                    break;
                }
            }

            response.status(200).send({
                movies: tmdbResponse.data.results, 
                id: id, genreName: genreName, 
                page: tmdbResponse.data.page, 
                totalPages: tmdbResponse.data.total_pages, 
                totalResults: tmdbResponse.data.total_results 
            });
        }).catch(() => {
            response.status(502).send({ message: "Woops! Something went wrong on our end! Please try again" });
        });
    })
; // close router.route("/:id")

module.exports = router;