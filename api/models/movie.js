const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema (
    {
        backdrop_path: {
            type: String,
            required: false
        },
        budget: {
            type: Number,
            required: false
        },
        cast: {
            type: Array,
            required: false
        },
        crew: {
            type: Array,
            required: false
        },
        genres: {
            type: Array,
            required: false
        },
        images: {
            type: Object,
            required: false
        },
        overview: {
            type: String,
            required: false
        },
        poster_path: {
            type: String,
            required: false
        },
        production_companies: {
            type: Array,
            required: false
        },
        recommendations: {
            type: Array,
            required: false
        },
        release_date: {
            type: String,
            required: false
        },
        runtime: {
            type: Number,
            required: false
        },
        status: {
            type: String,
            required: false
        },
        tagline: {
            type: String,
            required: false
        },
        title: {
            type: String,
            required: true
        },
        tmdb_id: {
            type: Number,
            required: true
        },
        videos: {
            type: Array,
            required: false
        }
    },
    {
        timestamps: true
    }
);

MovieSchema.query.watchList = function(){
    return this.where({
        on_watchlist: true
    });
};

MovieSchema.query.rated = function(){
    return this.where({
        rating: {$gt: 0}
    })
}

MovieSchema.query.favourites = function(){
    return this.where({
        on_favourite_list: true
    })
}

module.exports = mongoose.model("Movie", MovieSchema);