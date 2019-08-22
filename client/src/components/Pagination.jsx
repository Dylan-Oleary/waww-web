import React, { useState, useEffect } from 'react';
import { navigate, useQueryParams } from 'hookrouter';
import { toast } from 'react-toastify';
import Toastr from './Toastr';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft as previous, faCaretRight as next } from '@fortawesome/free-solid-svg-icons';

import { isNumber } from '../utils/formFieldValidators';

const Pagination = ({ initialPage, totalPages }) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [customPage, setCustomPage] = useState(null);
    const [queryParams , setQueryParams] = useQueryParams();
    
    useEffect(() => {
        if(currentPage !== initialPage){
            setQueryParams({title: queryParams.title, page: currentPage});
            navigate('/search', false, queryParams);
        }

    }, [currentPage])

    const nextPage = () => {
        if(currentPage + 1 <= totalPages){
            setCurrentPage(currentPage + 1);
        }
    }

    const previousPage = () => {
        if(currentPage - 1 !== 0){
            setCurrentPage(currentPage - 1);
        }
    }

    const handlePageNumberClick = page => {
        setCurrentPage(page)
    }

    const handleCustomPageInputChange = event => {
        event.preventDefault();

        setCustomPage(event.target.value)
    }

    const handleCustomPageSubmit = event => { 
        event.preventDefault();

        if(customPage > totalPages || customPage < 1 || customPage == currentPage || !(isNumber(customPage))){
            const messages = customPage == currentPage ? ["You are already on this page"] : ["This page doesn't exist!"];

            return toast(<Toastr messages={messages} type={"error"} alertFor={'clientError'} />, { containerId: "error" });
        }else {
            setCurrentPage(customPage)
        }
    }

    const renderPages = () => {
        const buffer = 2;
        let pages = [];

        const pagination = {
            startAt: currentPage - buffer,
            endAt: currentPage + buffer,
            maxPageNo: totalPages
        };

        if (pagination.startAt < 1) {
            const offset = (1 - pagination.startAt);

            pagination.startAt = 1;
            pagination.endAt += offset;
        }
        if (pagination.endAt > pagination.maxPageNo) {
            const offset = (pagination.endAt - pagination.maxPageNo);

            pagination.endAt = pagination.maxPageNo;
            pagination.startAt -= offset;
            if (pagination.startAt <= 0) {
                pagination.startAt = 1;
            }
        }

        for(let i = pagination.startAt; i <= pagination.endAt; i++){
            pages.push(i)
        }

        return pages.map(page => {
            if(page === currentPage){
                return (
                    <span className="active pagination-number" key={`page-${page}`}>{page}</span>
                )
            }else{
                return (
                    <span className="inactive pagination-number" onClick={() => handlePageNumberClick(page)} key={`page-${page}`}>{page}</span>
                )
            }
        })
    }

    const renderPageSelect = () => {
        return (
            <form className="custom-page-wrapper" onSubmit={e => handleCustomPageSubmit(e)} >
                <input onChange={e => handleCustomPageInputChange(e)} value={customPage} />
                <span>{`/ ${totalPages}`}</span>
            </form>
        )
    }

    return (
        <div id="Pagination">
            <div className="pages-wrapper">
                <FontAwesomeIcon icon={previous} onClick={() => previousPage()} />
                {renderPages()}
                <FontAwesomeIcon icon={next} onClick={() => nextPage()} />
            </div>
            {renderPageSelect()}
        </div>
    )
}

const mapStateToProps = ({ search }) => {
    return {
        totalPages: search.totalPages,
        totalResults: search.totalResults
    }
}

export default connect(mapStateToProps)(Pagination);