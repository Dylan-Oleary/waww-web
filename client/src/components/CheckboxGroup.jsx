import React from 'react';

import { formatGenres } from '../utils/genreFormatter';
import { sortByID } from '../utils/arrayHelpers';

const genres = [
    { "id": 28, "name": "Action" },
    { "id": 12, "name": "Adventure" },
    { "id": 16, "name": "Animation" },
    { "id": 35, "name": "Comedy" },
    { "id": 80, "name": "Crime" },
    { "id": 99, "name": "Documentary" },
    { "id": 18, "name": "Drama" },
    { "id": 10751, "name": "Family" },
    { "id": 14, "name": "Fantasy" },
    { "id": 36, "name": "History" },
    { "id": 27, "name": "Horror" },
    { "id": 10402, "name": "Music" },
    { "id": 9648, "name": "Mystery" },
    { "id": 10749, "name": "Romance" },
    { "id": 878, "name": "Science Fiction" },
    { "id": 10770, "name": "TV Movie" },
    { "id": 53, "name": "Thriller" },
    { "id": 10752, "name": "War" },
    { "id": 37, "name": "Western" }
]

const CheckboxGroup = ({ input, type, disabled }) => {
    const selectedGenres = sortByID([...input.value]);

    const onInputChange = (event, inputValue) => {
        event.persist();

        if(!event.target.nextSibling.checked) {
            event.target.nextSibling.checked = true;
            return input.onChange(sortByID([...selectedGenres, inputValue]))
        } else {
            event.target.nextSibling.checked = false;
            return input.onChange(selectedGenres.filter(genre => genre.id !== inputValue.id))
        };        
    }

    const initialValueCheck = id => {
        const check = selectedGenres.filter(genre => genre.id === id);

        return check.length ? true : false
    }

    const renderCheckboxes = () => {
        return genres.map(genre => {
            const checked = selectedGenres.filter(selectedGenre => selectedGenre.id === genre.id ? true : false );

            return (
                <div key={genre.id} className={checked && checked.length ? "checkbox-selected" : ""}>
                    <label onClick={event => onInputChange(event, genre)}>{genre.name}</label>
                    <input 
                        value={genre.id} 
                        type={type}
                        onChange={event => onInputChange(event, genre)}
                        defaultChecked={initialValueCheck(genre.id)}
                        hidden
                    />
                </div>
            )
        })
    }

    return (
        <div id="CheckboxGroup" className={disabled ? "list" : "selections"}>
            {
                disabled ? <div className="flex">{selectedGenres && selectedGenres.length ? formatGenres(selectedGenres).map(genre => genre) : "N/A"}</div> : renderCheckboxes()
            }
        </div>
    )
}

export default CheckboxGroup;


