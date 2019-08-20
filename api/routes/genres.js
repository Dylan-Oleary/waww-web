const router = require("express").Router();
const tmdb = require('./apis/tmdb');

const alert = {
    alertMessages: [],
    alertFor: null
}

router.get('/:id', (req, res)  => {
    const { id } = req.params;

    tmdb.get('/discover/movie', {
        params: {
            api_key: process.env.TMDB_KEY,
            language: "en-US",
            region: "US",
            sort_by: "vote_count.desc",
            include_adult: false,
            with_genres: id,
            page: 1,
        }
    })
    .then( response => {
        res.status(200).send({ results: response.data.results, id: id, page: response.data.page })
    })
    .catch ( err => {
        alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
        alert.alertFor = "TMDB API ERROR"
    
        res.status(502).send({ alert });
    })
})

module.exports = router;