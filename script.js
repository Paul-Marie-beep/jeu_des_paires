"use strict";

const app = document.querySelector(".app");
const wrapper = document.querySelector(".wrapper");
const cardsContainers = document.querySelectorAll(".card-container");
const startButton = document.querySelector(".start-button");
const restartButton = document.querySelector(".restart-button");
const popupStart = document.querySelector(".popup-start");
const endGame = document.querySelector(".endgame");
const timer = document.querySelector(".endgame-timer");
const labelTimer = document.querySelector(".timer");
const defeatPopup = document.querySelector(".endgame-defeat");
const defeatbtn = document.querySelector(".defeat-popup-btn");
const levelPopup = document.querySelector(".popup-level");
const btnDur = document.querySelector(".level-btn-dur");
const btnTresDur = document.querySelector(".level-btn-tres-dur");
const btnImpossible = document.querySelector(".level-btn-impossible");

let visiblePicCounter = 0;
let cardValueOne;
let cardValueTwo;
let cardsLeft = 10;
let countdown;
let time;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions
///////////////////////////
// Helper
/////////////////
// Cacher toutes les cartes
const hideAllCards = function () {
  cardsContainers.forEach((div) => {
    div.classList.add("hidden");
  });
};
const hideTimer = function () {
  timer.classList.add("hidden");
};
/////////////////

// initialiser le jeu
const initGame = function () {
  hideAllCards();
  hideTimer();
  endGame.classList.add("hidden");
  defeatPopup.classList.add("hidden");
  levelPopup.classList.add("hidden");
  document.removeEventListener("keydown", reloadPage);
  document.removeEventListener("keydown", startGame);
};

// Chosir son niveau

const choseLevel = function () {
  popupStart.classList.add("hidden");
  levelPopup.classList.remove("hidden");
  document.removeEventListener("keydown", choseLevel);
};

const levelImpliesTime = function (e) {
  e.preventDefault();
  if (e.target.classList.contains("level-btn-dur")) {
    time = 120;
    startGame(120);
  } else if (e.target.classList.contains("level-btn-tres-dur")) {
    time = 60;
    startGame(60);
  } else if (e.target.classList.contains("level-btn-impossible")) {
    startGame(25);
  }
};
// Commencer à jouer en appuyant sur le bouton du popup
const startGame = function (time) {
  levelPopup.classList.add("hidden");
  timer.classList.remove("hidden");
  cardsContainers.forEach((div) => {
    div.classList.remove("hidden");
  });
  defeatPopup.classList.add("hidden");
  countdown = startEndGameTimer(time);
};

// Timer pour fin du jeu
const startEndGameTimer = function (time) {
  const tic = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      defeat();
    }
    time--;
  };
  // Set timer to 2 minutes.
  tic();
  const timer = setInterval(tic, 1000);
  return timer;
};

// Retourner deux cartes
const getResult = function (e, visiblePicCounter) {
  e.target.classList.add("hidden");
  visiblePicCounter++;
  if (visiblePicCounter === 1) {
    cardValueOne = e.target.closest(".card-container").querySelector(".cardpic")
      .dataset.ident;
  } else if (visiblePicCounter === 2) {
    cardValueTwo = e.target.closest(".card-container").querySelector(".cardpic")
      .dataset.ident;
  }
  return [visiblePicCounter, cardValueOne, cardValueTwo];
};

//  Cacher les deux cartes retournées si elles sont identiques
const hideCardsPair = function (cardValueOne) {
  setTimeout(() => {
    document
      .querySelectorAll(`.${cardValueOne}-cardpic`)
      .forEach((div) => div.classList.add("hidden"));
    visiblePicCounter = 0;
  }, 1000);
  return visiblePicCounter;
};

// Retounrner les cartes si elles ne sont pas identiques
const badPairingReturnCards = function (cardValueOne, cardValueTwo) {
  setTimeout(() => {
    document.querySelectorAll(`.${cardValueOne}-cardback`).forEach((carte) => {
      carte.classList.remove("hidden");
    });
    document.querySelectorAll(`.${cardValueTwo}-cardback`).forEach((carte) => {
      carte.classList.remove("hidden");
    });
    visiblePicCounter = 0;
    cardValueOne = "un";
    cardValueTwo = "deux";
  }, 1000);
  return [visiblePicCounter, cardValueOne, cardValueTwo];
};

// Mettre fin au jeu si on a trouvé toutes les cartes
const victory = function () {
  setTimeout(() => {
    endGame.classList.remove("hidden");
    hideTimer();
    clearInterval(countdown);
  }, 1500);
};

const defeat = function () {
  setTimeout(() => {
    hideAllCards();
    hideTimer();
    clearInterval(countdown);
    defeatPopup.classList.remove("hidden");
    defeatbtn.addEventListener("click", reloadPage);
    document.addEventListener("keydown", reloadPage);
  }, 900);
};

// Processus global du jeu
const playGame = function (e) {
  e.preventDefault();
  if (e.target.classList.contains("cardback") && visiblePicCounter < 2) {
    [visiblePicCounter, cardValueOne, cardValueTwo] = getResult(
      e,
      visiblePicCounter
    );
  }
  if (visiblePicCounter === 2) {
    if (cardValueOne === cardValueTwo) {
      cardsLeft--;
      hideCardsPair(cardValueOne);
    } else {
      [visiblePicCounter, cardValueOne, cardValueTwo] = badPairingReturnCards(
        cardValueOne,
        cardValueTwo
      );
    }
  }

  if (cardsLeft === 0) {
    victory();
    restartButton.addEventListener("click", reloadPage);
    document.addEventListener("keydown", reloadPage);
  }
};

// Reload Page
const reloadPage = function () {
  document.location.reload();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions calls
/////////////////////////////////
// Popup au début
initGame();

// Appui bouton start ou press enter
startButton.addEventListener("click", choseLevel);
document.addEventListener("keydown", choseLevel);

// Révéler la carte quand on clique dessus
wrapper.addEventListener("click", playGame);

//Popup choisir le level : actions sur les boutons
levelPopup.addEventListener("click", levelImpliesTime);
