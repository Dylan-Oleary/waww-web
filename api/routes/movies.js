const router = require("express").Router();
const tmdb = require('./apis/tmdb');
const Movie = require('../models/movie');

const alert = {
    alertMessages: [],
    alertFor: null
}

router.get(`/search`, (req, res) => {
    //Search the API for movies with the title, we get back an Array
    tmdb.get("search/movie", {
        params: {
            api_key: process.env.TMDB_KEY,
            language: "en-US",
            query: req.query.searchTerm,
            page: 1,
            include_adult: false
        }
    }).then( response => {
        if (response.data.results.length === 0){
            res.send('no movies found');
        }else {
            res.send({
                currentSearch: req.query.searchTerm,
                searchResults: response.data.results
            })
        }
    }).catch(err => {
        console.log(err)
    })
});

router.post(`/`, async (req, res) => {
    //Check if the tmdb_id exists in our MovieDB, if not let's add it so we can add custom things like comments and reviews from the site
    const dbMovie = await Movie.findOne({
        $or:
            [
                {"_id": req.body._id},
                {"tmdb_id": req.body.tmdb_id}
            ]
    })

    if(!dbMovie){
        const response = await tmdb.get(`movie/${req.body.tmdb_id}`, {
            params: {
                api_key: process.env.TMDB_KEY,
                movie_id: req.body.tmdb_id,
                append_to_response: "credits,recommendations,images,videos"                
            }
        }).catch(err => {
            console.log("Woops - LINE 53")
        });

        const recommendedMovies = await response.data.recommendations.results.map(movie => {
            return {
                poster_path: movie.poster_path,
                release_date: movie.release_date,
                title: movie.title,
                tmdb_id: movie.id
            }
        });

        Movie.create({
            backdrop_path: response.data.backdrop_path,
            budget: response.data.budget,
            cast: response.data.credits.cast,
            crew: response.data.credits.crew,
            genres: response.data.genres,
            images: response.data.images,
            overview: response.data.overview,
            poster_path: response.data.poster_path,
            production_companies: response.data.production_companies,
            recommendations: recommendedMovies,
            release_date: response.data.release_date,
            runtime: response.data.runtime,
            status: response.data.status,
            tagline: response.data.tagline,
            title: response.data.title,
            tmdb_id: response.data.id,
            videos: response.data.videos.results
        })
        .then( movie => {
            res.send(movie);
        })
        .catch( err => {
            console.log("Line 86");
        })
    }else{
        res.send(dbMovie);
    }
});

router.get('/now-playing', async (req, res) => {
    tmdb.get("/movie/now_playing", {
        params: {
            api_key: process.env.TMDB_KEY,
            language: "en-US",
            region: "US",
            page: 1,
        }
    }).then( response => {
        const nowPlaying = response.data.results.slice(0, 11).map( movie => {
            return {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                backdrop_path: movie.backdrop_path,
                release_date: movie.release_date
            }
        });

        res.status(200).send({ nowPlaying })

    }).catch( err => {
        alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
        alert.alertFor = "TMDB API ERROR"
    
        res.status(502).send({ alert });
    })
});

router.get('/popular', async (req, res) => {
    tmdb.get("/movie/popular", {
        params: {
            api_key: process.env.TMDB_KEY,
            language: "en-US",
            region: "US",
            page: 1,
        }
    }).then( response => {
        const popular = response.data.results.map( movie => {
            return {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                backdrop_path: movie.backdrop_path,
                release_date: movie.release_date
            }
        });

        res.status(200).send({ popular })

    }).catch( err => {
        alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
        alert.alertFor = "TMDB API ERROR"
    
        res.status(502).send({ alert });
    })
})

router.get('/top-rated', async (req, res) => {
    tmdb.get("/movie/top_rated", {
        params: {
            api_key: process.env.TMDB_KEY,
            language: "en-US",
            region: "US",
            page: 1,
        }
    }).then( response => {
        const topRated = response.data.results.map( movie => {
            return {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                backdrop_path: movie.backdrop_path,
                release_date: movie.release_date
            }
        });

        res.status(200).send({ topRated })

    }).catch( err => {
        alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
        alert.alertFor = "TMDB API ERROR"
    
        res.status(502).send({ alert });
    })
})

router.get('/upcoming', async (req, res) => {
    tmdb.get('/movie/upcoming', {
        params: {
            api_key: process.env.TMDB_KEY,
            language: "en-US",
            region: "US",
            page: 1
        }
    }).then( response => {
        const upcoming = response.data.results.slice(1, 7).map( movie => {
            return {
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                backdrop_path: movie.backdrop_path,
                release_date: movie.release_date
            }
        });

        res.status(200).send({ upcoming });
    }).catch( err => {
        alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
        alert.alertFor = "TMDB API ERROR"
    
        res.status(502).send({ alert });
    })
});

module.exports = router;