const router = require("express").Router();
const tmdb = require('./apis/tmdb');
const { genres } = require('../constants');

const alert = {
    alertMessages: [],
    alertFor: null
}

router.get('/:id', (req, res)  => {
    const { id } = req.params;
    const { primaryReleaseDateGTE, primaryReleaseDateLTE, certification, sortBy, page } = req.query;

    tmdb.get('/discover/movie', {
        params: {
            api_key: process.env.TMDB_KEY,
            language: "en-US",
            region: "US",
            sort_by: sortBy,
            include_adult: false,
            certification_country: "US",
            certification: certification ? certification : null,
            with_genres: id,
            page: page,
            'primary_release_date.gte': primaryReleaseDateGTE ? primaryReleaseDateGTE : null,
            'primary_release_date.lte': primaryReleaseDateLTE ? primaryReleaseDateLTE : null
        }
    })
    .then( response => {
        let genreName;
        for(let i = 0; i < genres.length; i++){
            if(id == genres[i].id){
                genreName = genres[i].name;
                break;
            }
        }

        res.status(200).send({ movies: response.data.results, id: id, genreName: genreName, page: response.data.page, totalPages: response.data.total_pages, totalResults: response.data.total_results })
    })
    .catch ( err => {
        alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
        alert.alertFor = "TMDB API ERROR"

        res.status(502).send({ alert });
    })
})

module.exports = router;