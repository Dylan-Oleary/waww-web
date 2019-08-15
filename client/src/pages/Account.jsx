import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { A } from 'hookrouter';

import UpdateUserForm from '../components/UpdateUserForm';
import { formatDate } from '../utils/dateFormatter';
import altLogo from '../public/assets/images/pink-blue-circle.svg';
import ListViewCard from '../components/ListViewCard';

const Account = ({ user }) => {
    const [isLoading, setIsLoading] = useState(true);
    const tabs = [
        {key: 0, title: "General"},
        {key: 1, title: "Profile"}
    ]
    const [currentTab, setCurrentTab] = useState(tabs[0]);

    useEffect(() => {
        if(user._id){
            setIsLoading(false);
        }
    }, [user]);

    const renderLoader = () => {
        return <div className="ui active loader massive"></div>
    }

    const renderListRow = (list, title) => {
        let listItems = [];

        if(list.length >= 3){
            listItems = list.slice(list.length - 3, list.length).reverse();
        }else {
            listItems = list.reverse();
        }

        return (
            <div className="list-row">
                <h3>{title}</h3>
                <div className="flex">
                    { 
                        listItems && listItems.length ? (
                            listItems.map(movie => <ListViewCard movie={movie} size={"small"}/>)
                        ) : (
                            <p className="prompt-big">You have no movies in this list</p>
                        )
                    }
                </div>
            </div>
        )
    }

    const renderTab = () => {
        switch(currentTab.key){
            case 0 :
                return (
                    <div id="ProfileGeneral">
                        <div className="list-columns">
                            {renderListRow(user.watchlist, "Recently Added To Backlog" )}
                            {renderListRow(user.viewed, "Recently Watched")}
                            {renderListRow(user.favourites, "Recently Added To Favourites")}
                        </div>
                        <div className="recent-table">
                            <h3>Recent Activity</h3>
                            <div className="table-content">
                                {
                                    user.recentActivity && user.recentActivity.length ? (
                                        user.recentActivity.reverse().map(activity => {
                                            return (
                                                <div className="table-item">
                                                    <p><A className="link-blue" href={`/movies/${activity.tmdb_id}`}>{`${activity.title} (${activity.release_date.substr(0,4)}) `}</A>{activity.message}</p>
                                                    <p className="footer">{formatDate(activity.date)}</p>
                                                </div>
                                            )
                                        })
                                    ) : <p>No Recent Activity To Show</p>
                                }
                            </div>
                        </div>
                    </div>
                )
            case 1 :
                return (
                    <UpdateUserForm />
                )
            default :
                return null;
        }
    }

    const renderContent = () => {
        return (
            <Fragment>
                <div className="left-sidebar">
                    <img className="image-rounded" src={altLogo}/>
                    <div className="sidebar-title">
                        <h2 className="title-medium">{`${user.firstName} ${user.lastName}`}</h2>
                        <p className="italic">{user.username}</p>
                    </div>
                    <div className="sidebar-meta">
                        <div>
                            <p>E-mail: <span>{user.email}</span></p>
                        </div>
                        <div>
                            <p>Member Since: <span>{formatDate(user.createdAt)}</span></p>
                        </div>
                    </div>
                    <div className="sidebar-horiztonal-hr"></div>
                    <div className="sidebar-data">
                        <div>
                            <p><span className="number-medium">{user.watchlist.length}</span>{user.watchlist.length === 1 ? ' movie' : ' movies'} in backlog</p>
                        </div>
                        <div>
                            <p><span className="number-medium">{user.viewed.length}</span>{user.viewed.length === 1 ? ' movie' : ' movies'} watched</p>
                        </div>
                        <div>
                            <p><span className="number-medium">{user.favourites.length}</span>{user.favourites.length === 1 ? ' movie' : ' movies'} favourited</p>
                        </div>
                        <div>
                            <p><span className="number-medium">67</span> ratings & comments</p>
                        </div>
                    </div>
                    <div className="sidebar-footnote">
                        <p>Account last updated on {formatDate(user.updatedAt)}</p>
                    </div>
                </div>
                <div className="sidebar-vertical-hr"></div>
                <div className="sidebar-content">
                    <div className="content-headers">
                        <h2 className={currentTab.key === 0 ? "active-tab" : "tab"} onClick={() => setCurrentTab(tabs[0])}>{tabs[0].title}</h2>
                        <h2 className={currentTab.key === 1 ? "active-tab" : "tab"} onClick={() => setCurrentTab(tabs[1])}>{tabs[1].title}</h2>
                    </div>
                    <div className="sidebar-content-body">
                        {renderTab()}
                    </div>
                </div>
            </Fragment>
        )
    }

    return (
        <div id="Account">
            {isLoading ? renderLoader() : renderContent()}
        </div>
    )
}

const mapStateToProps = ({ user }) => {
    return { user }
}

export default connect(mapStateToProps)(Account);