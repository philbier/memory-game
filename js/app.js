//Create a list that holds all of your cards
const deckNode = document.querySelector(".deck");
const cardNodes = document.querySelectorAll(".card");
const restartNode = document.querySelector(".restart");
const movesNode = document.querySelector(".moves");
const starsNode = document.querySelector(".stars");
const winningPanel = document.getElementById("winningScreen");
const btnPlayAgain = document.getElementById("btnPlay");
const winningText = document.getElementById("winningText");
const winningTime = document.getElementById("winningTime");
const startDate = new Date();

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
    winningPanel.style.display = 'none';
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
        let currentCard;
        currentCard = event.target;

        switch(arrCurrentCardNodes.length) {
            case 0:
                isRelevantCardElement(currentCard) ? turnCardFaceUp(currentCard) : false; 
                break;
            case 1:
                isRelevantCardElement(currentCard) && isSameAsPreviousCard(currentCard) ? turnCardFaceUp(currentCard) : false; 
        }

        if(arrCurrentCardNodes.length==2){
            increaseMoves();
            checkMatching();
            checkGameWin();

            //reset turn
            arrCurrentCardNodes = [];
        }
    }
});

let isSameAsPreviousCard = cardNode => {
    return  cardNode.compareDocumentPosition(arrCurrentCardNodes[0]) != 20 
}

let turnCardFaceUp = (cardNode) => {
    cardNode.classList.toggle('open');
    cardNode.classList.toggle('show');
    arrCurrentCardNodes.push(cardNode.childNodes[1]);
}

//checks wether this node is an LI-Element and...
//does not belong to an already found correct combination
let isRelevantCardElement = (cardNode) => {
    return cardNode.nodeName === 'LI' && !(cardNode.classList.contains('match'));
}

function checkMatching(arr) {
    return (arrCurrentCardNodes[0].classList.value != arrCurrentCardNodes[1].classList.value ? resetTurn(arrCurrentCardNodes) : correctGuess(arrCurrentCardNodes));
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

btnPlayAgain.onclick = restart;

function showWinningPannel() {
    winningPanel.style.display = 'flex';
    winningText.textContent = `You have won with ${movesNode.textContent} moves and ${remainGuesses/2} stars. Awesome!`
    winningTime.textContent = getPlayTime(startDate, new Date());
}

function getPlayTime(startDate,endDate) {
    let totalSec = Math.round((endDate.getTime() - startDate.getTime())/1000,0);
    let minutes = parseInt(totalSec/60);
    let seconds = totalSec % 60;
    return `Playing time: ${minutes}min ${seconds}sec`
}
