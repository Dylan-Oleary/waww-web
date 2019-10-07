const router = require("express").Router();
const tmdb = require('./apis/tmdb');
const Movie = require('../models/movie');
const Review = require("../models/review");
const jwt = require("jsonwebtoken");
const secret = process.env.TOKEN_SECRET;
const requestAuthentication = require("../utils/isAuthenticated");
const mongoose = require("mongoose");

const alert = {
    alertMessages: [],
    alertFor: null
}

router.route("/now-playing")
    .get((request, response) => {
        tmdb.get("/movie/now_playing", {
            params: {
                api_key: process.env.TMDB_KEY,
                language: "en-US",
                region: "US",
                page: 1,
            }
        }).then(recordSet => {
            const nowPlaying = recordSet.data.results.slice(0, 11).map( movie => {
                return {
                    _id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    backdrop_path: movie.backdrop_path,
                    release_date: movie.release_date
                }
            });
    
            response.status(200).send({ nowPlaying })
    
        }).catch( err => {
            alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
            alert.alertFor = "TMDB API ERROR"
        
            response.status(502).send({ alert });
        })
    })
;

router.route("/popular")
    .get((request, response) => {
        tmdb.get("/movie/popular", {
            params: {
                api_key: process.env.TMDB_KEY,
                language: "en-US",
                region: "US",
                page: 1,
            }
        }).then(recordSet => {
            const popular = recordSet.data.results.map( movie => {
                return {
                    _id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    backdrop_path: movie.backdrop_path,
                    release_date: movie.release_date
                }
            });
    
            response.status(200).send({ popular })
    
        }).catch( err => {
            alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
            alert.alertFor = "TMDB API ERROR"
        
            response.status(502).send({ alert });
        })
    })
;

router.route("/top-rated")
    .get((request, response) => {
        tmdb.get("/movie/top_rated", {
            params: {
                api_key: process.env.TMDB_KEY,
                language: "en-US",
                region: "US",
                page: 1,
            }
        }).then(recordSet => {
            const topRated = recordSet.data.results.map( movie => {
                return {
                    _id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    backdrop_path: movie.backdrop_path,
                    release_date: movie.release_date
                }
            });
    
            response.status(200).send({ topRated })
    
        }).catch( err => {
            alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
            alert.alertFor = "TMDB API ERROR"
        
            response.status(502).send({ alert });
        })
    })
;

router.route("/upcoming")
    .get((request, response) => {
        tmdb.get('/movie/upcoming', {
            params: {
                api_key: process.env.TMDB_KEY,
                language: "en-US",
                region: "US",
                page: 1
            }
        }).then(recordSet => {
            const upcoming = recordSet.data.results.slice(1, 7).map( movie => {
                return {
                    _id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    backdrop_path: movie.backdrop_path,
                    release_date: movie.release_date
                }
            });
    
            response.status(200).send({ upcoming });
        }).catch( err => {
            alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
            alert.alertFor = "TMDB API ERROR"
        
            response.status(502).send({ alert });
        })
    })
;

router.route("/random")
    .get((request, response) => {
        const randomPage = Math.ceil(Math.random() * (150 - 1) + 1);
        const randomPageItem = Math.floor(Math.random() * 19);

        tmdb.get('/discover/movie', {
            params: {
                api_key: process.env.TMDB_KEY,
                language: "en-US",
                region: "US",
                sort_by: "popularity.desc",
                include_adult: false,
                page: randomPage
            }
        }).then(result => {
            response.status(200).send({ movie: result.data.results[randomPageItem] })
        }).catch( err => {
            alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
            alert.alertFor = "TMDB API ERROR"
        
            response.status(502).send({ alert });
        })
    })
;

router.route("/:movieID")
    .get((request, response) => {
        Movie.findById(parseInt(request.params.movieID)).then(movie => {
            if(movie !== null && movie !== undefined){
                response.status(200).send(movie);
            }else {
                return tmdb.get(`movie/${request.params.movieID}`, {
                    params: {
                        api_key: process.env.TMDB_KEY,
                        append_to_response: "credits,recommendations,images,videos"
                    }
                }).then(movie => {
                    const recommendedMovies = movie.data.recommendations.results.map(movie => {
                        return {
                            _id: movie.id,
                            poster_path: movie.poster_path,
                            release_date: movie.release_date,
                            title: movie.title
                        }
                    });

                    Movie.create({
                        _id: movie.data.id,
                        backdrop_path: movie.data.backdrop_path,
                        budget: movie.data.budget,
                        cast: movie.data.credits.cast,
                        crew: movie.data.credits.crew,
                        genres: movie.data.genres,
                        images: movie.data.images,
                        overview: movie.data.overview,
                        poster_path: movie.data.poster_path,
                        production_companies: movie.data.production_companies,
                        recommendations: recommendedMovies,
                        release_date: movie.data.release_date,
                        runtime: movie.data.runtime,
                        status: movie.data.status,
                        tagline: movie.data.tagline,
                        title: movie.data.title,
                        videos: movie.data.videos.results
                    }).then(movie => {
                        response.status(200).send(movie);
                    }).catch(err => {
                        console.log(err);
                    })
                }).catch(error => {
                    console.log(error);
                })
            }
        }).catch(err => {
            console.log(err);
        })
    })
;

router.route("/:movieID/reviews")
    .get((request, response) => {
        Review.aggregate([
            { $match: { movieID: parseInt(request.params.movieID) } },
            { $lookup : {
                from: "users",
                localField: "userID",
                foreignField: "_id",
                as: "userDetails"
                }
            }
        ]).then(reviews => {
            const formattedReviews = reviews.map(review => {
                const userDetails = review.userDetails[0];

                return {
                    _id: review._id,
                    title: review.title,
                    rating: review.rating,
                    review: review.review,
                    movieID: review.movieID,
                    createdAt: review.createdAt,
                    updatedAt: review.updatedAt,
                    user: {
                        _id: userDetails._id,
                        profilePicture: {
                            publicID: userDetails.profilePicture.publicID,
                            secureURL: userDetails.profilePicture.secureURL
                        },
                        username: userDetails.username
                    }
                }
            });

            response.status(200).send({ formattedReviews });
        }).catch(error => {
            console.log(error);
        });
    })
    .post(async (request, response) => {
        const authenticatedUser = await requestAuthentication(request.headers.authorization);

        if(authenticatedUser){
            const { title, review } = request.body.formData;
            return new Promise((resolve, reject) => {
                Review.findOne({
                    userID: authenticatedUser,
                    movieID: request.params.movieID
                }).then(existingReview => {
                    if(existingReview){
                        reject();
                    }else {
                        resolve();
                    }
                }).catch(() => {
                    response.sendStatus(500);
                })
            }).then(() => {
                Review.create({
                    title: title.trim(),
                    review: review.trim(),
                    userID: mongoose.Types.ObjectId(authenticatedUser),
                    movieID: request.params.movieID
                }).then(newReview => {
                    const token = jwt.sign({ id: authenticatedUser }, secret, {
                        expiresIn: '8h'
                    });
   
                    response.status(201).send({ newReview, token });
                }).catch(error => {
                    console.log(error);
                    alert.alertMessages = ["Woops, something went wrong on our end! Sorry"];
                    alert.alertFor = "TMDB API ERROR";
    
                    response.status(500).send({ alert });
                });
            }).catch(error => {
                response.sendStatus(403);
            })
        }else {
            alert.alertMessages = ["You must be logged in order to leave a review!"];
            alert.alertFor = "nullJWT";

            response.status(401).send({ alert });
        }
    })
; //close router.route("/:movieID/reviews")

router.route("/:movieID/reviews/:reviewID")
    .put(async (request, response) => {
        const authenticatedUser = await requestAuthentication(request.headers.authorization);

        if(authenticatedUser){
            return new Promise((resolve, reject) => {
                Review.findById(request.params.reviewID).then(review => {
                    if(review.userID == authenticatedUser){
                        resolve();
                    }else {
                        reject();
                    }
                }).catch(() => {
                    response.sendStatus(500);
                })
            }).then(() => {
                const { title, review } = request.body.formData;

                Review.findByIdAndUpdate(request.params.reviewID, {
                    title: title.trim(),
                    review: review.trim()
                }, {
                    runValidators: true,
                    new: true
                }).then(updatedReview => {
                    const token = jwt.sign({ id: authenticatedUser }, secret, {
                        expiresIn: '8h'
                    });

                    response.status(200).send({ updatedReview, token });
                }).catch(() => {
                    response.sendStatus(500);
                })
            }).catch(() => {
                response.sendStatus(401);
            });
        }else {
            response.sendStatus(401);
        }
    })
    .delete(async (request, response) => {
        const authenticatedUser = await requestAuthentication(request.headers.authorization);

        if(authenticatedUser){
            return new Promise((resolve, reject) => {
                Review.findById(request.params.reviewID).then(review => {
                    if(review.userID == authenticatedUser){
                        resolve(review.remove());
                    }else {
                        reject();
                    }
                });
            }).then(deletedReview => {
                const token = jwt.sign({ id: authenticatedUser }, secret, {
                    expiresIn: '8h'
                });

                alert.alertMessages = [`Review was successfully deleted!`];
                alert.alertFor = "successfulReview";

                response.status(200).send({ deletedReview, token, alert });
            }).catch(() => {
                response.sendStatus(401);
            })
        }else {
            response.sendStatus(401);
        }
    })
; //close router.route("/:movieID/reviews")
module.exports = router;