exports.sortByID = arr => {
    return arr.sort((a, b) => {
        const idA = a.id
        const idB = b.id

        if(idA < idB) return -1;
        if(idA > idB) return 1;
        return 0;
    })
}

exports.equalArrays = (arr1, arr2) => {
    if(arr1.length !== arr2.length)
        return false;;
    for(let i = arr1.length; i--;) {
        if(arr1[i].id !== arr2[i].id)
            return false;
    }
    return true;
}