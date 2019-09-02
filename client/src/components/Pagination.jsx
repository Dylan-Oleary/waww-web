import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Toastr from './Toastr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft as previous, faCaretRight as next } from '@fortawesome/free-solid-svg-icons';

import { isNumber } from '../utils/formFieldValidators';

const Pagination = ({ initialPage, totalPages, changePage }) => {
    const [customPage, setCustomPage] = useState(null);

    const nextPage = () => {
        if(initialPage + 1 <= totalPages){
            changePage(initialPage + 1);
        }
    }

    const previousPage = () => {
        if(initialPage - 1 !== 0){
            changePage(initialPage - 1);
        }
    }

    const handlePageNumberClick = page => {
        changePage(page)
    }

    const handleCustomPageInputChange = event => {
        event.preventDefault();

        setCustomPage(event.target.value)
    }

    const handleCustomPageSubmit = event => { 
        event.preventDefault();

        if(customPage > totalPages || customPage < 1 || customPage == initialPage || !(isNumber(customPage))){
            const messages = customPage == initialPage ? ["You are already on this page"] : ["This page doesn't exist!"];

            return toast(<Toastr messages={messages} type={"error"} alertFor={'clientError'} />, { containerId: "error" });
        }else {
            changePage(customPage)
        }
    }

    const renderPages = () => {
        const buffer = 2;
        let pages = [];

        const pagination = {
            startAt: initialPage - buffer,
            endAt: initialPage + buffer,
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
            if(page === initialPage){
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
            <form className="custom-page" onSubmit={e => handleCustomPageSubmit(e)} >
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
            <div className="custom-page-wrapper">
                <label>Go To Page: </label>
                {renderPageSelect()}
            </div>
        </div>
    )
}

export default Pagination;