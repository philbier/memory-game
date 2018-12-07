//Create a list that holds all of your cards
const deckNode = document.querySelector(".deck");
const cardNodes = document.querySelectorAll(".card");
const restartNode = document.querySelector(".restart");

let cardsArray = Array.prototype.slice.call(cardNodes);

/* Main Controller that starts the game */
(function mainController() {
    restart();
})();

function restart() {

    //remove all children
    for (const element of cardNodes) {
        element.remove();
    };

    //shuffle cardsArray
    cardsArray = shuffle(cardsArray);
    

    for (const element of cardsArray) {
        deckNode.appendChild(element);
    }

    turnAllCardsFaceDown(cardsArray);

}

function turnAllCardsFaceDown(arr) {
    for (const element of arr) {
        element.className = 'card';
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//Event Listener for all "Click"-Card Events
let cardsTurned = 0;
let arrCurrentCardNodes = [];  

deckNode.addEventListener('click', function(event) {
    let currentNode = event.target;
    
    if (currentNode.nodeName === 'LI') {
        //*TODO - is there a more elegant way of getting the specific node
        arrCurrentCardNodes.push(currentNode.childNodes[1]);
        event.target.classList.toggle('open');
        event.target.classList.toggle('show');
        cardsTurned += 1;
    } 

    if(cardsTurned == 2) {
        checkMatching(arrCurrentCardNodes);
        cardsTurned = 0;
        arrCurrentCardNodes = []; 
        increaseMoves();
        decreaseStars();
    }

});

function checkMatching(arr) {
    return (arr[0].classList.value != arr[1].classList.value ? resetTurn(arr) : false);
}

function resetTurn(arr) {
    for (const element of arr) {
        element.parentNode.classList.toggle('open');
        element.parentNode.classList.toggle('show');
    }
}

function increaseMoves() {

}

function decreaseStars() {

}

restartNode.addEventListener('click', function() {
    restart();
});

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
