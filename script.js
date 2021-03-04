"use strict";

const wrapper = document.querySelector(".wrapper");
const cardsContainers = document.querySelectorAll(".card-container");
const startButton = document.querySelector(".start-button");
const restartButton = document.querySelector(".restart-button");
const popupStart = document.querySelector(".popup-start");
const endGame = document.querySelector(".endgame");

const pourBosser = 10;

let visiblePicCounter = 0;
let cardValueOne;
let cardValueTwo;
let cardsLeft = pourBosser;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions
///////////////////////////

// initialiser le jeu
const initGame = function () {
  cardsContainers.forEach((div) => {
    div.classList.add("hidden");
  });
  endGame.classList.add("hidden");
};

// Commencer à jouer en appuyant sur le bouton du popup
const startGame = function (e) {
  e.preventDefault();
  cardsContainers.forEach((div) => {
    div.classList.remove("hidden");
    popupStart.classList.add("hidden");
  });
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
const finishGame = function () {
  setTimeout(() => {
    endGame.classList.remove("hidden");
  }, 1500);
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
    finishGame();
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions calls
/////////////////////////////////
// Popup au début
initGame();

// Appui bouton start
startButton.addEventListener("click", startGame);

// Révéler la carte quand on clique dessus
wrapper.addEventListener("click", playGame);

// Bouton restart
restartButton.addEventListener("click", function () {
  document.location.reload();
});
