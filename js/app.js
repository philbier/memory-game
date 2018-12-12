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
let starsArray  = Array.prototype.slice.call(starsNode.childNodes).filter(function(element){
    return element.nodeName === 'LI';
});

let cardsTurned = 0;
let arrCurrentCardNodes = []; 
let clickDisabeld = false; 

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

    //reset stars
    for (const element of starsArray) {
        element.firstChild.classList = 'fa fa-star';
    } 

    //ensure that all cards are face down
    turnAllCardsFaceDown(cardsArray);

    //reset counter variables
    movesNode.textContent = 0;
    correctCombinations = 0;
    remainGuesses = 6;
    clickDisabeld = false;
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


deckNode.addEventListener('click', function(event) {
    if(!clickDisabeld) {
        let currentNode = event.target;
        if (currentNode.nodeName === 'LI' && !(currentNode.classList.contains('match'))) {
            //*TODO - is there a more elegant way of getting the specific node
            arrCurrentCardNodes.push(currentNode.childNodes[1]);
            event.target.classList.toggle('open');
            event.target.classList.toggle('show');
            cardsTurned += 1;
        } 
    
        if(cardsTurned == 2) {
            increaseMoves();

            //check wether card combination is valid
            checkMatching(arrCurrentCardNodes);

            //reset turn
            cardsTurned = 0;
            arrCurrentCardNodes = [];

            checkGameWin();
        }
    }
});

function checkMatching(arr) {
    return (arr[0].classList.value != arr[1].classList.value ? resetTurn(arr) : correctGuess(arr));
}

function resetTurn(arr) {
    clickDisabeld = true; //delay next user interaction until cards are face down again
    remainGuesses -= 1;

    for (const element of arr) {
        element.parentNode.classList.toggle('no-match');
    }

    if(decreaseStars()) {
        setTimeout(function () { 
            for (const element of arr) {
                element.parentNode.classList.toggle('open');
                element.parentNode.classList.toggle('show');
                element.parentNode.classList.toggle('no-match');
            }
            clickDisabeld = false;
        }, 800);
    }
}

function correctGuess(arr) {
    correctCombinations += 1;

    for (const element of arr) {
        element.parentNode.classList.toggle('match');
    }
}

function increaseMoves() {
    movesNode.textContent = parseInt(movesNode.textContent) + 1;
}

function decreaseStars() {
    //logic has to be that every wrong move, half a star gets subtracted
    if(remainGuesses > 0) {

        let tmp = parseInt(remainGuesses/2);
       
        if(remainGuesses % 2 != 0){
            starsArray[tmp].firstChild.classList.remove("fa-star");
            starsArray[tmp].firstChild.classList.toggle("fa-star-half-empty");

        } else {
            starsArray[tmp].firstChild.classList.remove("fa-star-half-empty");
            starsArray[tmp].firstChild.classList.toggle("fa-star-o");
        }

        return true;
    } else {
        restart();
        alert("You lost!");
        return false;
    }
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
