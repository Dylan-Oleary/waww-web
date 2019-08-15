import React, { Fragment } from 'react';

import ListViewCard from './ListViewCard';

const ListView = ({ type, items }) => {
    const renderContent = () => {
        switch(type){
            case 'movie':
                return items.map( movie => {
                    return <ListViewCard key={movie.tmdb_id} movie={movie} />
                })
            case 'production':
                return items.map( productionCompany => {
                    return (
                        <div key={productionCompany.id} className="flex-column">
                            <img className="ui fluid image medium" src={`https://image.tmdb.org/t/p/original/${productionCompany.logo_path}`}/>
                            <h2>{productionCompany.name}</h2>
                        </div>
                    )
                })
            case 'verticalList':
                return (
                    <div className="flex-column">
                        <div className="vertical-list">
                            <h2>Cast</h2>
                            {
                                items[0].map( item => {
                                    
                                })
                            }
                        </div>
                        <div className="vertical-list">
                            <h2>Crew</h2>
                            {
                                items[1].map( item => {
                                    console.log(item)
                                })
                            }
                        </div>
                    </div>
                )
            default:
                return items.map( movie => {
                    return <ListViewCard key={movie.tmdb_id} movie={movie} />
                })
        }
    }

    return (
        <div id="ListView">
            {renderContent()}
        </div>
    )
}

export default ListView;