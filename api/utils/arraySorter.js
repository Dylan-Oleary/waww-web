exports.sortByID = arr => {
    return arr.sort((a, b) => {
        const idA = a.id
        const idB = b.id

        if(idA < idB) return -1;
        if(idA > idB) return 1;
        return 0;
    })
}