export const showModal = (title, content, type) => {
    return { type: "SHOW_MODAL", payload: {title, content, type }};
}

export const closeModal = () => {
    return { type: "CLOSE_MODAL" };
}