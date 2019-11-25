import Action from '../public/assets/images/discover-action.png';
import Adventure from '../public/assets/images/discover-adventure.png';
import Animation from '../public/assets/images/discover-animation.png';
import Comedy from '../public/assets/images/discover-comedy.png';
import Crime from '../public/assets/images/discover-crime.png';
import Documentary from '../public/assets/images/discover-documentary.png';
import Drama from '../public/assets/images/discover-drama.png';
import Family from '../public/assets/images/discover-family.png';
import Fantasy from '../public/assets/images/discover-fantasy.png';
import History from '../public/assets/images/discover-history.png';
import Horror from '../public/assets/images/discover-horror.png';
import Music from '../public/assets/images/discover-music.png';
import Mystery from '../public/assets/images/discover-mystery.png';
import Romance from '../public/assets/images/discover-romance.png';
import ScienceFiction from '../public/assets/images/discover-science-fiction.png';
import TvMovie from '../public/assets/images/discover-tv-movie.png';
import Thriller from '../public/assets/images/discover-thriller.png';
import War from '../public/assets/images/discover-war.png';
import Western from '../public/assets/images/discover-western.png';

import { userLogout } from "../redux/actions/session";

const date = new Date().toISOString();

export const userNavItems = [
    { id: 0, name: "Account", slug: "account" }
]

export const genres = [
    { "id": 28, "name": "Action", slug: "action", backdropPath: Action },
    { "id": 12, "name": "Adventure", slug: "adventure", backdropPath: Adventure },
    { "id": 16, "name": "Animation", slug: "animation", backdropPath: Animation },
    { "id": 35, "name": "Comedy", slug: "comedy", backdropPath: Comedy },
    { "id": 80, "name": "Crime", slug: "crime", backdropPath: Crime },
    { "id": 99, "name": "Documentary", slug: "documentary", backdropPath: Documentary },
    { "id": 18, "name": "Drama", slug: "drama", backdropPath: Drama },
    { "id": 10751, "name": "Family", slug: "family", backdropPath: Family },
    { "id": 14, "name": "Fantasy", slug: "fantasy", backdropPath: Fantasy },
    { "id": 36, "name": "History", slug: "history", backdropPath: History },
    { "id": 27, "name": "Horror", slug: "horror", backdropPath: Horror },
    { "id": 10402, "name": "Music", slug: "music", backdropPath: Music },
    { "id": 9648, "name": "Mystery", slug: "mystery", backdropPath: Mystery },
    { "id": 10749, "name": "Romance", slug: "romance", backdropPath: Romance },
    { "id": 878, "name": "Sci-Fi", slug: "science-fiction", backdropPath: ScienceFiction },
    { "id": 10770, "name": "TV Movie", slug: "tv-movie", backdropPath: TvMovie },
    { "id": 53, "name": "Thriller", slug: "thriller", backdropPath: Thriller },
    { "id": 10752, "name": "War", slug: "war", backdropPath: War },
    { "id": 37, "name": "Western", slug: "western", backdropPath: Western }
]

export const certificationFilters = [
    {
        "id": 0,
        "title": "All",
        "value": null
    },
    {
        "id": 1,
        "title": "R",
        "value": "R",
        "meaning": "Under 17 requires accompanying parent or adult guardian 21 or older. The parent/guardian is required to stay with the child under 17 through the entire movie, even if the parent gives the child/teenager permission to see the film alone. These films may contain strong profanity, graphic sexuality, nudity, strong violence, horror, gore, and strong drug use. A movie rated R for profanity often has more severe or frequent language than the PG-13 rating would permit. An R-rated movie may have more blood, gore, drug use, nudity, or graphic sexuality than a PG-13 movie would admit."
    },
    {
        "id": 2,
        "title": "NC-17",
        "value": "NC-17",
        "meaning": "These films contain excessive graphic violence, intense or explicit sex, depraved, abhorrent behavior, explicit drug abuse, strong language, explicit nudity, or any other elements which, at present, most parents would consider too strong and therefore off-limits for viewing by their children and teens. NC-17 does not necessarily mean obscene or pornographic in the oft-accepted or legal meaning of those words."
    },
    {
        "id": 3,
        "title": "PG-13",
        "value": "PG-13",
        "meaning": "Some material may be inappropriate for children under 13. Films given this rating may contain sexual content, brief or partial nudity, some strong language and innuendo, humor, mature themes, political themes, terror and/or intense action violence. However, bloodshed is rarely present. This is the minimum rating at which drug content is present."
    },
    {
        "id" : 4,
        "title": "PG",
        "value": "PG",
        "meaning": "Some material may not be suitable for children under 10. These films may contain some mild language, crude/suggestive humor, scary moments and/or violence. No drug content is present. There are a few exceptions to this rule. A few racial insults may also be heard."
    },
    {
        "id": 5,
        "title": "G",
        "value": "G",
        "meaning": "All ages admitted. There is no content that would be objectionable to most parents. This is one of only two ratings dating back to 1968 that still exists today."
    }
]

export const releaseDateFilters = [
    {
        "id": 0,
        "title": "All",
        "primaryReleaseDateGTE": null,
        "primaryReleaseDateLTE": date.substr(0,10)
    },
    {
        "id": 1,
        "title": "2010 - Current",
        "primaryReleaseDateGTE": '2010-01-01',
        "primaryReleaseDateLTE": null
    },
    {
        "id": 2,
        "title": "2000 - 2009",
        "primaryReleaseDateGTE": '2000-01-01',
        "primaryReleaseDateLTE": '2009-12-31'
    },
    {
        "id": 3,
        "title": "1990 - 1999",
        "primaryReleaseDateGTE": '1990-01-01',
        "primaryReleaseDateLTE": '1999-12-31'
    },
    {
        "id": 4,
        "title": "1980 - 1989",
        "primaryReleaseDateGTE": '1980-01-01',
        "primaryReleaseDateLTE": '1989-12-31'
    },
    {
        "id": 5,
        "title": "1970 - 1979",
        "primaryReleaseDateGTE": '1970-01-01',
        "primaryReleaseDateLTE": '1979-12-31'
    },
    {
        "id": 6,
        "title": "1960 - 1969",
        "primaryReleaseDateGTE": '1960-01-01',
        "primaryReleaseDateLTE": '1969-12-31'
    },
    {
        "id": 7,
        "title": "1959 >",
        "primaryReleaseDateGTE": null,
        "primaryReleaseDateLTE": '1959-12-31'
    }
]

export const sortOptions = [
    { "id": 0, "name": "Popularity - High to Low", "option": "vote_count.desc"},
    { "id": 1, "name": "Popularity - Low to High", "option": "vote_count.asc"},
    { "id": 2, "name": "Release Date - New to Old", "option": "primary_release_date.desc"},
    { "id": 3, "name": "Release Date - Old to New", "option": "primary_release_date.asc"},
    { "id": 4, "name": "Revenue - High to Low", "option": "revenue.desc"},
    { "id": 5, "name": "Revenue - Low to High", "option": "revenue.asc"}
]