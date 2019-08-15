import React from 'react';

import altProfileImage from '../public/assets/images/pink-blue-circle.svg';

const CommentCard = () => {
    return (
        <div id="CommentCard">
            <div className="comment-card-header">
                <img className="ui circular image tiny" src={altProfileImage} />
                <div className="flex-column">
                    <div className="flex">
                        <h2 className="review-title">This movie was honestly bad, man</h2>
                        <div>RATING</div>
                    </div>
                    <p>Written by Rusty Shackleford on July 3rd, 2019</p>
                </div>
            </div>
            <div className="comment-card-body">
                <p>The blowfish puffs himself up four, five times larger than normal and why? Why does he do that? So that it makes him intimidating, that's why. Intimidating! So that the other, scarier fish are scared off. And that's you! You are a blowfish. You see it's just all an illusion. You see it's... it's nothing but air. Now... who messes with the blowfish, Jesse? You're damn right. You are a blowfish. Say it again. Say it like you mean it. You're a BLOWFISH! </p>
            </div>

        </div>
    )
}

export default CommentCard;