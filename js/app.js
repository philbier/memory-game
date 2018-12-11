//Create a list that holds all of your cards
const deckNode = document.querySelector(".deck");
const cardNodes = document.querySelectorAll(".card");
const restartNode = document.querySelector(".restart");
const movesNode = document.querySelector(".moves");
const starsNode = document.querySelector(".stars");

const winThreshold = 8;
let correctCombinations, remainGuesses;

//use map-function?
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
    
    //place shuffled cards on deck
    for (const element of cardsArray) {
        deckNode.appendChild(element);
    }

    //ensure that all cards are face down
    turnAllCardsFaceDown(cardsArray);

    //reset move-counter
    movesNode.textContent = 0;
    correctCombinations = 0;
    remainGuesses = 6;
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
let clickDisabeld = false; 

deckNode.addEventListener('click', function(event) {
    if(!clickDisabeld) {
        let currentNode = event.target;
        if (currentNode.nodeName === 'LI') {
            //*TODO - is there a more elegant way of getting the specific node
            arrCurrentCardNodes.push(currentNode.childNodes[1]);
            event.target.classList.toggle('open');
            event.target.classList.toggle('show');
            cardsTurned += 1;
        } 
    
        if(cardsTurned == 2) {
            //check wether card combination is valid
            checkMatching(arrCurrentCardNodes);

            //reset turn
            cardsTurned = 0;
            arrCurrentCardNodes = [];

            increaseMoves();
            decreaseStars();
            checkGameWin();
        }
    }
});

function checkMatching(arr) {
    return (arr[0].classList.value != arr[1].classList.value ? resetTurn(arr) : correctCombinations += 1);
}

function resetTurn(arr) {
    //delay next user interaction
    clickDisabeld = true;

    setTimeout(function () { 
        for (const element of arr) {
            element.parentNode.classList.toggle('open');
            element.parentNode.classList.toggle('show');
        }
        clickDisabeld = false;
    }, 1500);

    //increase false moves
    remainGuesses -= 1;
}

function increaseMoves() {
    movesNode.textContent = parseInt(movesNode.textContent) + 1;
}

function decreaseStars() {
    let arrStarNodes  = Array.prototype.slice.call(starsNode.childNodes).filter(function(element){
        return element.nodeName === 'LI';
    });
    
    //TODO logic has to be that every wrong move, half a star gets subtracted
    if(remainGuesses > 0) {

        let tmp = remainGuesses/2;

        alert(parseInt(remainGuesses/2));
        if(remainGuesses % 0){
            arrStarNodes[tmp].firstChild.classList.toggle("fa-star");
            arrStarNodes[tmp].firstChild.classList.toggle("fa-star-o");
        } else {
            arrStarNodes[tmp].firstChild.classList.toggle("fa-star");
            arrStarNodes[tmp].firstChild.classList.toggle("fa-star-half-empty");
        }

    } else {
        alert("you lose! hahahah");
    }
    

    
    // arrStarNodes[arrStarNodes.length-1].firstChild.classList.toggle("fa-star-o");
    

}

function checkGameWin() {
    return correctCombinations == winThreshold ? showWinningPannel() : false;
}

restartNode.addEventListener('click', function() {
    restart();
});

function showWinningPannel() {
    alert(" You Win!! ");
}

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
