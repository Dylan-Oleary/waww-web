const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema (
    {
        title: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true,
            validate: {
                validator: function(value){
                    return new RegExp('^[0-9][0-9]?$|^100$').test(value);
                }
            }
        },
        review: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'movies',
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Review", ReviewSchema);