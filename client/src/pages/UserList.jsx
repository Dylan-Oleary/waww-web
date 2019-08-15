import React, { useEffect, useState } from 'react';
import { usePath } from 'hookrouter';
import { connect } from 'react-redux';

import ListViewCard from '../components/ListViewCard';

const UserList = ({ user }) => {
    const path = usePath();

    const renderContent = () => {
        if(user && user._id){
            switch(path){
                case "/users/watchlist" :
                    if(user.watchlist && user.watchlist.length > 0){
                        return (
                            user.watchlist.map( movie => {
                                return <ListViewCard key={movie.tmdb_id} movie={movie}/>
                            })
                        )
                    } else {
                        return <div>You have zero movies in the list</div>
                    }
                case "/users/favourites" :
                        if(user.favourites && user.favourites.length > 0){
                            return (
                                user.favourites.map( movie => {
                                    return <ListViewCard key={movie.tmdb_id} movie={movie}/>
                                })
                            )
                        } else {
                            return <div>You have zero movies in the favourites list</div>
                        }
                case "/users/viewed" :
                        if(user.viewed && user.viewed.length > 0){
                            return (
                                user.viewed.map( movie => {
                                    return <ListViewCard key={movie.tmdb_id} movie={movie}/>
                                })
                            )
                        } else {
                            return <div>You have zero movies in the viewed list</div>
                        }
            }
        } else {
            return <div className="ui active loader massive"></div>
        }
    }

    return (
        <div className="flex space-between">
            {renderContent()}
        </div>
    )
}

const mapStateToProps = ({ user, login }) => {
    return { user, login };
}

export default connect(mapStateToProps)(UserList);