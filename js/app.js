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
const endHeading = document.getElementById("endHeading")
const endPanel = document.getElementById("endScreen");
const btnPlayAgain = document.getElementById("btnPlay");
const endText = document.getElementById("endText");
const endTime = document.getElementById("endTime");

//using spread-operator to put nodelists into an array;
let cardsArray = [...cardNodes]; 
let starsArray = [...starsNode.childNodes].filter( (element) => element.nodeName === 'LI');

restart();

/* IIFE that (re)starts the game */
function restart(){
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
    gameVariables.correctCombinations = 0;  //add property for correct guesses and set it to 0 
    gameVariables.remainGuesses = 6;        //add property for remaining guesses and set it to 0
    gameVariables.startDate = new Date();   //add property for starting date/time and set it to "now"

    //helper variables used for each turn the player makes
    moveVariables.currentCards = [];        //add property for current cards per move as and empty array
    moveVariables.clickDisabled = false;    //enable the possibility to click cards

    //reset UI 
    movesNode.textContent = 0;              //reset moves counter in scoring panel
    endPanel.style.display = 'none';    //hide winningPanel
};

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

                if(moveVariables.currentCards.length==2){
                    increaseMoves();
                    checkMatching();
                    checkGameWin();
        
                    //reset turn
                    moveVariables.currentCards = [];
                }
        }
    }
});

//compares the current card and the one that was selected before during one turn...
//...returns true if both are exactly the same elements.
let isSameAsPreviousCard = cardNode => {
    return cardNode.compareDocumentPosition(moveVariables.currentCards[0]) != 20 
}

let turnCardFaceUp = cardNode => {
    cardNode.classList.toggle('open');
    cardNode.classList.toggle('show');
    moveVariables.currentCards.push(cardNode.childNodes[1]);
}

//checks wether this node is an LI-Element and...
//...does not belong to an already found correct combination
let isRelevantCardElement = cardNode => {
    return cardNode.nodeName === 'LI' && !(cardNode.classList.contains('match'));
}

//checks whether both cards in "currentCards"-Array are matching
let checkMatching = () => {
    let arr = moveVariables.currentCards;
    return (arr[0].classList.value != arr[1].classList.value ? resetTurn(arr) : correctGuess(arr));
}

//indicates that both selected cards are not matching...
//...and then turns them face down again
function resetTurn(arr) {
    clickDisabled = true;               //delay next user interaction until cards are face down again
    gameVariables.remainGuesses -= 1;   //a wrong move decreases the remainingGuesses

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

//indicates that both selected cards are a match
function correctGuess(arr) {
    gameVariables.correctCombinations += 1;

    for (const element of arr) {
        element.parentNode.classList.toggle('match');
    }
}

//increases the move counter in the UI
function increaseMoves() {
    movesNode.textContent = parseInt(movesNode.textContent) + 1;
}

//for every wrong move this script gets executed and half a star gets subtracted
function decreaseStars() {
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
        showEndPanel("What a bummer!", "lost");
        return false;
    }
}

//the game is won if all 8 (winThreshold) combinations are found
function checkGameWin() {
    return gameVariables.correctCombinations == gameVariables.winThreshold ? showEndPanel("Congratulations!", "won") : false;
}

//event listener for the restart button at the top
restartNode.addEventListener('click', function() {
    restart();
});

//shows a winning panel with game statistics like, number of moves, number of remaining guesses...
//...and how many stars are left
function showEndPanel(heading, result) {
    endPanel.style.display = 'flex';
    endHeading.textContent = `${heading}`;
    endText.textContent = `You have ${result} with ${movesNode.textContent} moves and ${gameVariables.remainGuesses/2} stars!`
    endTime.textContent = getPlayTime(gameVariables.startDate, new Date());
}

//assign restart event for winning/losing panel
btnPlayAgain.onclick = restart;

//get playing time formatted in minutes and seconds
function getPlayTime(startDate,endDate) {
    let totalSec = Math.round((endDate.getTime() - startDate.getTime())/1000,0);
    let minutes = parseInt(totalSec/60);
    let seconds = totalSec % 60;
    return `Playing time: ${minutes}min ${seconds}sec`
}