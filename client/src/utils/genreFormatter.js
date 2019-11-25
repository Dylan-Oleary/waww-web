const allGenres = require("../constants").genres;

exports.formatGenres = genres => {
    const selectedGenres = allGenres.filter(genre => {
        return genres.includes(genre.id) ? true : false
    });

    const formattedGenres = [];

    for(let i = 0; i < selectedGenres.length; i++){
        i !== selectedGenres.length - 1 ? formattedGenres.push(`${selectedGenres[i].name}, `) : formattedGenres.push(selectedGenres[i].name)
    }
    
    return formattedGenres;
}