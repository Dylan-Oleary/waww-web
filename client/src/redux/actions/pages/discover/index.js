import expressServer from '../../../../api';
import { certificationFilters, sortOptions, releaseDateFilters } from '../../../../constants';


export const getDiscoverPageContent = filters => {
    const { id, releaseDates, certification, sortBy, page } = filters;

    return async dispatch => {
        expressServer.get(`/api/genres/${id}`, {
            params: {
                primaryReleaseDateGTE: releaseDates.primaryReleaseDateGTE ? releaseDates.primaryReleaseDateGTE : null,
                primaryReleaseDateLTE: releaseDates.primaryReleaseDateLTE ? releaseDates.primaryReleaseDateLTE : null,
                certification: certification.value ? certification.value : null,
                sortBy: sortBy.option,
                page: page
            }
        })
        .then( response => {
            const payload = {
                id: response.data.id,
                page: response.data.page,
                movies: response.data.movies,
                totalPages: response.data.totalPages,
                totalResults: response.data.totalResults
            }

            dispatch({ type: "GET_DISCOVER_PAGE_CONTENT", payload: payload })
        })
        .catch( err => {
            dispatch({ type: "LOG_ERROR", payload: err.response.data.alert });
        })
    }
}

export const setFilters = filters => {
    const { id, name, slug, releaseDates, certification, sortBy, page } = filters;

    return {
        type: "SET_FILTERS",
        payload: {
            id: id,
            name: name,
            slug: slug,
            filters: {
                releaseDates: releaseDates,
                certification: certification
            },
            sortBy: sortBy,
            page: page
        }
    }
}

export const setBackdrop = path => {
    return { type: "SET_BACKDROP", payload: path };
}

export const clearDiscoverPage = () => {
    return { type: "CLEAR_DISCOVER_PAGE" };
}