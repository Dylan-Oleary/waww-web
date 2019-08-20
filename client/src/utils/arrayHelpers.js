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

//Thanks to CoolAJ86 - https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
exports.shuffle = array => {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}