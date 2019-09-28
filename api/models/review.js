const mongoose = require("mongoose");
const User = require("./user");
const Movie = require("./movie");

const ReviewSchema = new mongoose.Schema (
    {
        title: {
            type: String,
            required: true
        },
        review: {
            type: String,
            required: true
        },
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        movieID: {
            type: Number,
            ref: 'movies',
            required: true
        }
    },
    {
        timestamps: true
    }
);

ReviewSchema.post("remove", function(next){
    return Promise.all([
        User.findOneAndUpdate({
            _id: this.userID
        }, {
            $pull: {
                reviews: this._id
            }
        }),
        Movie.findOneAndUpdate({
            _id: this.movieID
        }, {
            $pull: {
                reviews: this._id
            }
        })
    ]).then(() => {
        return next;
    })
});

ReviewSchema.post("save", function(next){
    return Promise.all([
        User.findOneAndUpdate({
            _id: this.userID
        }, {
            $push: {
                reviews: this._id
            }
        }),
        Movie.findOneAndUpdate({
            _id: this.movieID
        }, {
            $push: {
                reviews: this._id
            }
        })
    ]).then(() => {
        return next;
    })
});

module.exports = mongoose.model("Review", ReviewSchema);