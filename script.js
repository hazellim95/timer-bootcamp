// boardSize has to be an even number
const boardSize = 4;
const board = []; // board data structure i.e. to hold the cards
let firstCard = null;
let firstCardElement;
let deck;

// global variable to represent state of game - whether can continue playing, or time is up
let timeUp = false;

const message = document.createElement("div");
message.classList.add("output");
message.innerText = "Hello! Click to get matching cards. You have 3 minutes.";

// function to output message into message DOM element
const output = (text) => {
  message.innerText = text;
};

//**  Gameplay logic **//
const squareClick = (cardElement, column, row) => {
  console.log(cardElement);
  console.log("FIRST CARD DOM ELEMENT", firstCard);

  console.log("BOARD CLICKED CARD", board[column][row]);

  const clickedCard = board[column][row];

  // if user already clicked on this square i.e. if the cardElement's inner text is not empty, stop the execution
  if (cardElement.innerText !== "") {
    return;
  }

  // if this is the first turn
  if (firstCard === null) {
    console.log("first turn");
    // set the first card to the clickedCard
    firstCard = clickedCard;
    // flip the card over i.e. set the cardElement's innerText to be the name of the firstCard
    cardElement.innerText = firstCard.name;

    // store the cardElement in another variable in case it does not match
    firstCardElement = cardElement;

    // second turn
  } else {
    console.log("second turn");
    // Check if clickedCard matches the firstCard in name and suit
    if (
      clickedCard.name === firstCard.name &&
      clickedCard.suit === firstCard.suit
    ) {
      console.log("match");

      // turn the card over (initially, cardElement's innerText is blank)
      cardElement.innerText = clickedCard.name;
      // Show a match message for 3 seconds, then make it disappear
      output("It's a match!");
      setTimeout(() => {
        output("");
      }, 3000);
    } else {
      console.log("not a match");
      // turn the card over
      cardElement.innerText = clickedCard.name;
      // turn this card back over
      setTimeout(() => {
        cardElement.innerText = "";
        firstCardElement.innerText = "";
      }, 3000);
    }

    // reset the first card
    firstCard = null;
  }
};

//**  Game Initialisation logic **//

// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (board) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement("div");

  // give it a class for CSS purposes
  boardElement.classList.add("board");

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < board.length; i += 1) {
    // make a var for just this row of cards
    const row = board[i];

    // make an element for this row of cards
    const rowElement = document.createElement("div");
    rowElement.classList.add("row");

    // make all the squares for this row
    for (let j = 0; j < row.length; j += 1) {
      // create the square element
      const square = document.createElement("div");

      // set a class for CSS purposes
      square.classList.add("square");

      // set the click event
      // eslint-disable-next-line
      square.addEventListener("click", (event) => {
        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"
        squareClick(event.currentTarget, i, j);
      });

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

// Make the deck to output doubles of each card
const makeDeck = () => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ["hearts", "diamonds", "clubs", "spades"];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    console.log(`current suit: ${currentSuit}`);

    // loop to create all cards in this suit
    // rank 1-13
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // Convert rankCounter to string
      let cardName = `${rankCounter}`;

      // 1, 11, 12 ,13
      if (cardName === "1") {
        cardName = "ace";
      } else if (cardName === "11") {
        cardName = "jack";
      } else if (cardName === "12") {
        cardName = "queen";
      } else if (cardName === "13") {
        cardName = "king";
      }

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      console.log(`rank: ${rankCounter}`);

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      newDeck.push(card);
    }
  }

  return newDeck;
};

// Get a random index ranging from 0 (inclusive) to max (exclusive).
const getRandomIndex = (max) => Math.floor(Math.random() * max);

// Shuffle an array of cards
const shuffleCards = (cards) => {
  // Loop over the card deck array once
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    // Select a random index in the deck
    const randomIndex = getRandomIndex(cards.length);
    // Select the card that corresponds to randomIndex
    const randomCard = cards[randomIndex];
    // Select the card that corresponds to currentIndex
    const currentCard = cards[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cards[currentIndex] = randomCard;
    cards[randomIndex] = currentCard;
  }
  // Return the shuffled deck
  return cards;
};

const initGame = () => {
  console.log("Starting game..");
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  let doubleDeck = makeDeck();
  let deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }
  const boardEl = buildBoardElements(board);

  document.body.appendChild(boardEl);
  document.body.appendChild(message);

  //If time reaches 30 seconds, restart game
  setTimeout(() => {
    // get all square elements
    const cardElements = document.getElementsByClassName("square");
    // set all of them to blank through a loop
    for (i = 0; i < cardElements.length; i++) {
      cardElements[i].innerText = "";
    }
    // output message that time is up
    output("Time's up! Game has restarted.");
    console.log("Time's up! Game has restarted.");
  }, 180000);
};

initGame();
