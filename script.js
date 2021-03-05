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
const explosion = document.querySelector(".img-explo");
const exploDiv = document.querySelector(".explo");
const exploSound = new Audio("sounds/explo.mp3");

let visiblePicCounter = 0;
let cardValueOne;
let cardValueTwo;
let cardsLeft = 10;
let countdown;
let blink;
let time;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
  exploDiv.classList.add("hidden");
  document.removeEventListener("keydown", reloadPage);
  document.removeEventListener("keydown", startGame);
  startButton.addEventListener("click", choseLevel);
  document.addEventListener("keydown", choseLevel);
};

// Chosir son niveau

const choseLevel = function () {
  popupStart.classList.add("hidden");
  levelPopup.classList.remove("hidden");
  levelPopup.addEventListener("click", levelImpliesTime);
  document.removeEventListener("keydown", choseLevel);
};

const levelImpliesTime = function (e) {
  e.preventDefault();
  if (e.target.classList.contains("level-btn-dur")) {
    startGame(120);
  } else if (e.target.classList.contains("level-btn-tres-dur")) {
    startGame(20);
  } else if (e.target.classList.contains("level-btn-impossible")) {
    startGame(5);
  }
};
// Commencer à jouer en appuyant sur le bouton du popup
const startGame = function (time) {
  levelPopup.classList.add("hidden");
  timer.classList.remove("hidden");
  cardsContainers.forEach((div) => {
    div.classList.remove("hidden");
  });
  wrapper.addEventListener("click", playGame);
  defeatPopup.classList.add("hidden");
  countdown = startEndGameTimer(time);
  setTimeout(() => {
    blink = makeBackgroundblink();
  }, (3 / 4) * time * 1000 - 2000);
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
  tic();

  const timeLeft = setInterval(tic, 1000);
  return timeLeft;
};

// Faire clignoter la fond quand on s'approche de la fin du temps imparti
const makeBackgroundblink = function () {
  const tac = function () {
    document.body.style.background =
      "linear-gradient(to top left, #fa2c2c, #bb0f09)";
    setTimeout(() => {
      document.body.style.background =
        "linear-gradient(to top left, #fa2c2c, #850a06)";
    }, 1000);
  };

  const blinkleft = setInterval(tac, 2000);
  return blinkleft;
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
    document.body.style.background =
      "linear-gradient(to top left, #18ceee, #5577e6)";
    endGame.classList.remove("hidden");
    hideTimer();
    clearInterval(countdown);
    restartButton.addEventListener("click", reloadPage);
    document.addEventListener("keydown", reloadPage);
  }, 1500);
};

// Mettre fin au jeu si on dépasse le temps imparti
const defeat = function () {
  hideAllCards();
  hideTimer();
  clearInterval(countdown);
  clearInterval(blink);
  document.body.style.background =
    "linear-gradient(to top left, #fa2c2c, #bb0f09)";
  exploDiv.classList.remove("hidden");
  setTimeout(() => {
    explosion.classList.add("boum");
    exploSound.play();
  }, 100);
  setTimeout(() => {
    defeatPopup.classList.remove("hidden");
    defeatbtn.addEventListener("click", reloadPage);
    document.addEventListener("keydown", reloadPage);
    exploDiv.classList.add("hidden");
  }, 4100);
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
  }
};

// Reload Page
const reloadPage = function () {
  document.location.reload();
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions call

initGame();
