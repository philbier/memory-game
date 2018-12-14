//Game Statistics
const gameVariables = {
    winThreshold: 8
}

//object that stores helper variables used for each turn the player makes
const moveVariables = {}

//document objects
const deckNode = document.querySelector(".deck");
const cardNodes = document.querySelectorAll(".card");
const restartNode = document.querySelector(".restart");
const movesNode = document.querySelector(".moves");
const starsNode = document.querySelector(".stars");
const winningPanel = document.getElementById("winningScreen");
const btnPlayAgain = document.getElementById("btnPlay");
const winningText = document.getElementById("winningText");
const winningTime = document.getElementById("winningTime");

//using spread-operator to put nodelists into an array;
let cardsArray = [...cardNodes]; 
let starsArray = [...starsNode.childNodes].filter( (element) => element.nodeName === 'LI');

/* IIFE that (re)starts the game */
(restart = () => {
    //shuffle cardsArray
    cardsArray = shuffle(cardsArray);
    
    //shuffle card and put them on the deck
    //if an element already exists in the DOM the .appendChild() method will move it rather than duplicating it
    for (const element of cardsArray) {
        deckNode.appendChild(element);
        element.className = 'card';
    }

    //reset stars in scoring panel
    for (const element of starsArray) {
        element.firstChild.classList = 'fa fa-star';
    } 
 
    //reset game statistics
    gameVariables.correctCombinations = 0;  //
    gameVariables.remainGuesses = 6;        //
    gameVariables.startDate = new Date();   //

    //helper variables used for each turn the player makes
    moveVariables.currentCards = [];        //
    moveVariables.clickDisabled = false;    //

    movesNode.textContent = 0;              //reset moves counter in scoring panel
    winningPanel.style.display = 'none';    //hide winningPanel
})();

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
    if(!moveVariables.clickDisabled) {
        switch(moveVariables.currentCards.length) {
            case 0:
                isRelevantCardElement(event.target) ? turnCardFaceUp(event.target) : false; 
                break;
            case 1:
                isRelevantCardElement(event.target) && isSameAsPreviousCard(event.target) ? turnCardFaceUp(event.target) : false; 
        }
        
        if(moveVariables.currentCards.length==2){
            increaseMoves();
            checkMatching();
            checkGameWin();

            //reset turn
            moveVariables.currentCards = [];
        }
    }
});

let isSameAsPreviousCard = cardNode => {
    return cardNode.compareDocumentPosition(moveVariables.currentCards[0]) != 20 
}

let turnCardFaceUp = (cardNode) => {
    cardNode.classList.toggle('open');
    cardNode.classList.toggle('show');
    moveVariables.currentCards.push(cardNode.childNodes[1]);
}

//checks wether this node is an LI-Element and...
//does not belong to an already found correct combination
let isRelevantCardElement = (cardNode) => {
    return cardNode.nodeName === 'LI' && !(cardNode.classList.contains('match'));
}

function checkMatching() {
    let arr = moveVariables.currentCards;
    return (arr[0].classList.value != arr[1].classList.value ? resetTurn(arr) : correctGuess(arr));
}

function resetTurn(arr) {
    clickDisabled = true; //delay next user interaction until cards are face down again
    gameVariables.remainGuesses -= 1;

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
            clickDisabled = false;
        }, 800);
    }
}

function correctGuess(arr) {
    gameVariables.correctCombinations += 1;

    for (const element of arr) {
        element.parentNode.classList.toggle('match');
    }
}

function increaseMoves() {
    movesNode.textContent = parseInt(movesNode.textContent) + 1;
}

function decreaseStars() {
    //logic has to be that every wrong move, half a star gets subtracted
    if(gameVariables.remainGuesses > 0) {

        let tmp = parseInt(gameVariables.remainGuesses/2);
       
        if(gameVariables.remainGuesses % 2 != 0){
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
    return gameVariables.correctCombinations == gameVariables.winThreshold ? showWinningPannel() : false;
}

restartNode.addEventListener('click', function() {
    restart();
});

btnPlayAgain.onclick = restart;

function showWinningPannel() {
    winningPanel.style.display = 'flex';
    winningText.textContent = `You have won with ${movesNode.textContent} moves and ${gameVariables.remainGuesses/2} stars. Awesome!`
    winningTime.textContent = getPlayTime(gameVariables.startDate, new Date());
}

function getPlayTime(startDate,endDate) {
    let totalSec = Math.round((endDate.getTime() - startDate.getTime())/1000,0);
    let minutes = parseInt(totalSec/60);
    let seconds = totalSec % 60;
    return `Playing time: ${minutes}min ${seconds}sec`
}