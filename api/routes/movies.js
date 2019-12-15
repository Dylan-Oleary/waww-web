const router = require("express").Router();
const tmdb = require('./apis/tmdb');
const Movie = require('../models/movie');
const Review = require("../models/review");
const jwt = require("jsonwebtoken");
const secret = process.env.TOKEN_SECRET;
const requestAuthentication = require("../utils/isAuthenticated");
const mongoose = require("mongoose");

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
            const nowPlaying = recordSet.data.results.map( movie => {
                return {
                    _id: movie.id,
                    title: movie.title,
                    poster_path: `https://image.tmdb.org/t/p/original/${movie.poster_path}`,
                    backdrop_path: `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`,
                    release_date: movie.release_date || "",
                    path: `/movies/${movie.id}`,
                    label: `${movie.title} ${movie.release_date ? `(${movie.release_date.substring(0,4)})` : ""}`
                }
            });
    
            response.status(200).send({ nowPlaying });
        }).catch(() => {
            response.status(502).send({ message: "Woops! Something went wrong on our end! Please try again" });
        });
    })
; //close router.route("/now-playing")

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
                    poster_path: `https://image.tmdb.org/t/p/original/${movie.poster_path}`,
                    backdrop_path: `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`,
                    release_date: movie.release_date || "",
                    path: `/movies/${movie.id}`,
                    label: `${movie.title} ${movie.release_date ? `(${movie.release_date.substring(0,4)})` : ""}`
                }
            });
    
            response.status(200).send({ popular });;
        }).catch(() => {
            response.status(502).send({ message: "Woops! Something went wrong on our end! Please try again" });
        });
    })
; //close router.route("/popular")

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

            response.status(200).send({ topRated });
        }).catch(() => {
            response.status(502).send({ message: "Woops! Something went wrong on our end! Please try again" });
        });
    })
; //close router.route("/top-rated")

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
            const upcoming = recordSet.data.results.map( movie => {
                return {
                    _id: movie.id,
                    title: movie.title,
                    poster_path: `https://image.tmdb.org/t/p/original/${movie.poster_path}`,
                    backdrop_path: `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`,
                    release_date: movie.release_date || "",
                    path: `/movies/${movie.id}`,
                    label: `${movie.title} ${movie.release_date ? `(${movie.release_date.substring(0,4)})` : ""}`
                }
            });
    
            response.status(200).send({ upcoming });
        }).catch(() => {
            response.status(502).send({ message: "Woops! Something went wrong on our end! Please try again" });
        });
    })
; //close router.route("/upcoming")

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
            response.status(200).send({ movie: result.data.results[randomPageItem] });
        }).catch(() => {        
            response.status(502).send({ message: "Woops! Something went wrong on our end! Please try again" });
        });
    })
; //close router.route("/random")

router.route("/:movieID")
    .get((request, response) => {
        Movie.findById(parseInt(request.params.movieID)).then(movie => {
            if(movie !== null && movie !== undefined){
                response.status(200).send(movie);
            } else {
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
                    }).catch(() => {
                        response.status(500).send({ message: "Woops! Something went wrong on our end! Please try again" });
                    });
                }).catch(() => {
                    response.status(502).send({ message: "Woops! Something went wrong on our end! Please try again" });
                });
            }
        }).catch(() => {
            response.status(502).send({ message: "Woops! Something went wrong on our end! Please try again" });
        });
    })
; //close router.route("/movieID")

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
        }).catch(() => {
            response.status(500).send({ message: "Woops! Something went wrong on our end! Please try again" });
        });
    })
    .post((request, response) => {
        const authenticationID = requestAuthentication(request.headers.authorization);

        if(authenticationID){
            const { title, review } = request.body.formData;

            return new Promise((resolve, reject) => {
                Review.findOne({
                    userID: authenticationID,
                    movieID: request.params.movieID
                }).then(existingReview => {
                    if(existingReview){
                        reject();
                    } else {
                        resolve();
                    }
                }).catch(() => {
                    response.status(500).send({ message: "Woops! Something went wrong on our end! Please try again" });
                })
            }).then(() => {
                Review.create({
                    title: title.trim(),
                    review: review.trim(),
                    userID: mongoose.Types.ObjectId(authenticationID),
                    movieID: request.params.movieID
                }).then(newReview => {
                    const token = jwt.sign({ id: authenticationID }, secret, { expiresIn: "1h" });
   
                    response.status(201).send({ 
                        newReview,
                        token,
                        message: "Review was created successfully!"
                    });
                }).catch(() => {
                    response.status(500).send({ message: "Woops! Something went wrong on our end! Please try again" });
                });
            }).catch(() => {
                response.status(403).send({ message: "A review with this ID already exists!" });
            });
        } else {
            response.status(401).send({ message: "Authentication error!" });
        }
    })
; //close router.route("/:movieID/reviews")

router.route("/:movieID/reviews/:reviewID")
    .put((request, response) => {
        const authenticationID = requestAuthentication(request.headers.authorization);

        if(authenticationID){
            return new Promise((resolve, reject) => {
                Review.findById(request.params.reviewID).then(review => {
                    if(review.userID == authenticationID){
                        resolve();
                    }else {
                        reject();
                    }
                }).catch(() => {
                    response.status(500).send({ message: "Woops! Something went wrong on our end! Please try again" });
                });
            }).then(() => {
                const { title, review } = request.body.formData;

                Review.findByIdAndUpdate(request.params.reviewID, {
                    title: title.trim(),
                    review: review.trim()
                }, {
                    runValidators: true,
                    new: true
                }).then(updatedReview => {
                    const token = jwt.sign({ id: authenticationID }, secret, { expiresIn: "1h" });

                    response.status(200).send({ 
                        updatedReview,
                        token,
                        message: "Review was edited successfully!"
                    });
                }).catch(() => {
                    response.status(500).send({ message: "Woops! Something went wrong on our end! Please try again" });
                });
            }).catch(() => {
                response.status(401).send({ message: "Authentication error!" });
            });
        } else {
            response.status(401).send({ message: "Authentication error!" });
        }
    })
    .delete((request, response) => {
        const authenticationID = requestAuthentication(request.headers.authorization);

        if(authenticationID){
            return new Promise((resolve, reject) => {
                Review.findById(request.params.reviewID).then(review => {
                    if(review.userID == authenticationID){
                        resolve(review.remove());
                    }else {
                        reject();
                    }
                });
            }).then(deletedReview => {
                const token = jwt.sign({ id: authenticationID }, secret, { expiresIn: "1h" });

                response.status(200).send({ 
                    deletedReview,
                    token,
                    message: "Review was deleted successfully!"
                });
            }).catch(() => {
                response.status(401).send({ message: "Authentication error!" });
            });
        } else {
            response.status(401).send({ message: "Authentication error!" });
        }
    })
; //close router.route("/:movieID/reviews")

module.exports = router;