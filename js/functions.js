// BRONVERMELDING:
// Delen van een kaartspel maken heb ik uit deze bron gehaald, dit spel kaarten bevatte geen jokers,
// dus die heb ik zelf toe moeten voegen.
// https://www.thatsoftwaredude.com/content/6417/how-to-code-blackjack-using-javascript

let deck = [];
let openDeck = [];
let newHand = [];
let newBase = [];
let newBaseBottom = [];
let newBaseTop = [];
let players = [];
let currentTurn = 0;
const suits = ["spades", "diamonds", "clubs", "hearts"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];


const playersID = document.getElementById("players");
const deckID = document.getElementById("deck");
const newCard = document.getElementById('newCard');
// Create a card deck
newDeck = () => {
  // For each Suit
  for(let i = 0; i < suits.length; i++) {
    // Give each card a Suit
    for(let addSuits = 0; addSuits < values.length; addSuits++) {
      let weight = parseInt(values[addSuits]);
      let deny = [];

      // Change weight to a number for easier math & add rules
      if (values[addSuits] === "2") {
        deny = [];
      }
      if (values[addSuits] === "3") {
        deny = [];
      }
      if (values[addSuits] === "4") {
        deny = ["5", "6", "8", "9", "J", "Q", "K", "A"];
      }
      if (values[addSuits] === "5") {
        deny = ["6", "8", "9", "J", "Q", "K", "A"];
      }
      if (values[addSuits] === "6") {
        deny = ["8", "9", "J", "Q", "K", "A"];
      }
      if (values[addSuits] === "7") {
        deny = ["8", "9", "J", "Q", "K", "A"];
      }
      if (values[addSuits] === "8") {
        deny = ["7", "9", "J", "Q", "K", "A"];
      }
      if (values[addSuits] === "9") {
        deny = ["7", "J", "Q", "K", "A"];
      }
      if (values[addSuits] === "10") {
        deny = [];
      }
      if (values[addSuits] === "J") {
        weight = 11;
        deny = ["7", "Q", "K", "A"];
      }
      if (values[addSuits] === "Q") {
        weight = 12;
        deny = ["7", "K", "A"];
      }
      if (values[addSuits] === "K") {
        weight = 13;
        deny = ["7", "A"];
      }
      if (values[addSuits] === "A") {
        weight = 14;
        deny = ["7"];
      }

      let card = {Value: values[addSuits], Suit: suits[i], Weight: weight, Deny: deny};
      deck.push(card);
    }
  }
  for(let i = 0; i < 2; i++) {
    let jokerCards = {Value: "Joker", Suit: "Joker", Weight: 0, Deny: []};
    deck.push(jokerCards)
  }
};

// Shuffle the Cards
shuffle = () => {
  for (let i = 0; i < 1000; i++) {
    let cardPlaceOne = Math.floor((Math.random() * deck.length));
    let cardPlaceTwo = Math.floor((Math.random() * deck.length));
    let hold = deck[cardPlaceOne];

    deck[cardPlaceOne] = deck[cardPlaceTwo];
    deck[cardPlaceTwo] = hold;
  }
};

// Create each player (amount being amount of players)
addPlayers = (amount) => {
  players = [];
  for(let i = 1; i <= amount; i++) {
    let hand = [];
    let base = [];
    let player = { Name: "Player " + i, ID: i, Points: 0, Hand: hand, Base: base };
    players.push(player);
  }
};

// Add both players to board visually
PlayerUI = () => {
  playersID.innerHTML = '';

  for(let i = 0; i < players.length; i++) {
    let section_player = document.createElement('section');
    let section_playerId = document.createElement('section');
    let section_hand = document.createElement('section');
    let section_base = document.createElement('section');
    let section_showHand = document.createElement('button');
    let section_points = document.createElement('section');

    section_points.className = 'player-points';
    section_points.id = 'points_' + i;
    section_player.id = 'player_' + i;
    section_player.className = 'player-section';
    section_hand.id = 'hand_' + i;
    section_base.id = 'base_' + i;
    section_showHand.className = 'player-press';
    section_showHand.id = 'press_' + i;
    section_showHand.innerHTML = 'Show Cards';

    section_playerId.innerHTML = players[i].ID;
    // section_player.appendChild(section_playerId);
    section_player.appendChild(section_hand);
    section_player.appendChild(section_points);
    section_player.appendChild(section_base);

    playersID.appendChild(section_player);
    playersID.appendChild(section_showHand);

    showCards(i);
  }
};

// Initiate the game
initiateShithead = () => {
  let startButton = document.getElementById('startButton');
  let deckID = document.getElementById('deck');
  currentTurn = 0;
  startButton.innerHTML = "Restart";
  startButton.onclick = function() { restartShithead(currentTurn); };
  startButton.style.transform = "translate(300%, -50%)";
  deckID.style.display = "flex";
  // Deal all cards and setup game
  deck = [];
  openDeck = [];
  newDeck();
  shuffle();
  addPlayers(2);
  PlayerUI();
  dealAllHands();
  document.getElementById('hand_' + Number(!currentTurn)).classList.add('active');
  getPoints(0);
  getPoints(1);
};

restartShithead = (player) => {
  currentTurn = Number(!player);

  let handZero = document.getElementById('hand_' + 0);
  let baseZero = document.getElementById('base_' + 0);
  handZero.innerHTML = "";
  baseZero.innerHTML = "";
  players[0].Base = [];
  players[0].Hand = [];

  let handOne = document.getElementById('hand_' + 1);
  let baseOne = document.getElementById('base_' + 1);
  handOne.innerHTML = "";
  baseOne.innerHTML = "";
  players[1].Base = [];
  players[1].Hand = [];
  deck = [];
  openDeck = [];
  newCard.src = "./media/img/cards/empty.png";
  newDeck();
  shuffle();
  dealAllHands();
};
// Deal cards to each player's hand.
dealAllHands = () => {
  // 3 cards dealt to hand
  for (let i = 0; i < 3; i++) {
    for (let x = 0; x < players.length; x++) {
      let card = deck.pop();
      players[x].Hand.push(card);
      generateCards(card, x);
      updateDeck();
    }
  }
  // 6 cards dealt to base
  for (let i = 0; i < 6; i++) {
    for (let x = 0; x < players.length; x++) {
      let base = players[x].Base;
      let bottomCards = [];
      let topCards = [];
      let card = deck.pop();
      players[x].Base.push(card);

      bottomCards = players[x].Base.slice(Math.max(6 - 3, 3));
      topCards = players[x].Base.slice(Math.max(6 - 3, 1));

      generateBaseCards(card, x, bottomCards, topCards);

      updateDeck();
    }
  }
};

// Add cards to hand
generateCards = (card, player) => {
  let hand = document.getElementById('hand_' + player);
  hand.appendChild(cardUI(card, player));
};

// Put 6 cards down on the board
generateBaseCards = (card, player, bottomCards, topCards) => {

  // Add cards facing down to board
  if(topCards.length === 0) {
    for(let i = 0; i < bottomCards.length; i++) {
      if(card === bottomCards[i]) {
        let base = document.getElementById('base_' + player);
        base.appendChild(cardUIBack(card, player));
      }
    }
  }

  // Add cards facing top to board
  for(let i = 0; i < topCards.length; i++) {
    if(card === topCards[i]) {
      let base = document.getElementById('base_' + player);
      base.appendChild(cardUI(card, player));
    }
  }
};

// Create New Card, add class, image & onclick function (Card that is turned around.)
cardUIBack = (card, player) => {
  let el = document.createElement('img');
  el.className = 'backCard';
  el.src = "./media/img/cards/blue_back.png";
  el.onclick = () => {hitBoard(card, player);};
  return el;
};

// Create New Card, add class, image & onclick function
cardUI = (card, player) => {
  let el = document.createElement('img');
  el.className = 'card';
  el.src = "./media/img/cards/" + (card.Suit + card.Value) + ".png";
  el.onclick = () => {hitBoard(card, player);};
  return el;
};

// GAME --------------------------------------------------------

// Button to show & Hide your cards.
showCards = (i) => {
  let player = document.getElementById("hand_" + i);
  let press = document.getElementById("press_" + i);

  press.addEventListener('click', () => {
    if (i === 0) {
      if (player.style.marginTop === "-3%") {
        player.style.marginTop = "-25%";
        press.innerHTML = 'Show Cards';
      }
      else {
        player.style.marginTop = "-3%";
        press.innerHTML = 'Hide Cards';
      }
    }
    else  {
      if(player.style.marginBottom === "-3%") {
        player.style.marginBottom = "-25%";
        press.innerHTML = 'Show Cards';
      }
      else {
        player.style.marginBottom = "-3%";
        press.innerHTML = 'Hide Cards';
      }
    }
  });
};

// When the card is pressed.
hitBoard = (card, player) => {
  let index = players[player].Hand.indexOf(card);
  let baseIndex = players[player].Base.indexOf(card);
  let backCard = document.querySelector(".backCard");

  // if the back of a card is showing, dont play unless no open cards available
  if (backCard) {
    if(newBaseBottom.includes(card)){
      if(newBaseTop.length !== 0) {
        return false;
      }
    }
  }

  if (players[player].Hand.includes(card) && currentTurn !== player) {
    if(playOrTake(player, card)) {
      // Change the turn to the next player
      document.getElementById('hand_' + Number(!currentTurn)).classList.remove('active');
      currentTurn = player;
      document.getElementById('hand_' + Number(!currentTurn)).classList.add('active');

      // Push Card away to the openDeck,
      openDeck.push(card);
      updateOpenDeck(card);

      // And add a new card to Players Hand.
      if (players[player].Hand.length <= 3) {

        if(deck.length !== 0) {
          let newCard = deck.pop();
          players[player].Hand.splice(index, 1, newCard);
        } else {
          players[player].Hand.splice(index, 1);
        }
      }
      else {
        players[player].Hand.splice(index, 1);
      }
      updateDeck();
      updateHand(player, card);

      // Play 2 or more cards
      for(let i = 0;i < players[player].Hand.length; i++) {
        if(players[player].Hand[i].Value === card.Value){
          let newIndex = players[player].Hand.indexOf(players[player].Hand[i]);

          openDeck.push(players[player].Hand[i]);
          updateOpenDeck(players[player].Hand[i]);
          players[player].Hand.splice(newIndex, 1);

          // Prevent drawing a card if the deck is empty
          if(deck.length !== 0) {

            // draw a card if hand length is below 3
            if (players[player].Hand.length < 3) {
              for(let i = 0; 3 - players[player].Hand.length; i++) {
                let newCard = deck.pop();
                players[player].Hand.push(newCard);
              }
            }
          }

          // Card Rule (10)
          if (card.Weight === 10) {
            openDeck = [];
            let newCard = document.getElementById('newCard');
            newCard.src = "./media/img/cards/empty.png";
            document.getElementById('hand_' + Number(!currentTurn)).classList.remove('active');
            currentTurn = Number(!player);
            document.getElementById('hand_' + Number(!currentTurn)).classList.add('active');

          }

          updateDeck();
          newHand = players[player].Hand;
          emptyHand(player);
          generateNewCard(newHand[i], player);
          // Clear newHand Array
          newHand = [];
        }
      }

      // Card Rule (10)
      if (card.Weight === 10) {
        openDeck = [];
        let newCard = document.getElementById('newCard');
        newCard.src = "./media/img/cards/empty.png";
        document.getElementById('hand_' + Number(!currentTurn)).classList.remove('active');
        currentTurn = Number(!player);
        document.getElementById('hand_' + Number(!currentTurn)).classList.add('active');
      }


      // if 4 cards>same effect as 10
      if (openDeck.length >= 4) {
        if (openDeck[openDeck.length-2].Weight === card.Weight
            && openDeck[openDeck.length-3].Weight === card.Weight
            && openDeck[openDeck.length-4].Weight === card.Weight) {
          openDeck = [];
          let newCard = document.getElementById('newCard');
          newCard.src = "./media/img/cards/empty.png";
          document.getElementById('hand_' + Number(!currentTurn)).classList.remove('active');
          currentTurn = Number(!player);
          document.getElementById('hand_' + Number(!currentTurn)).classList.add('active');
        }
      }

    }
    //If hand is empty, use base
  }
  else if(players[player].Hand.length === 0 && players[player].Base.includes(card) && currentTurn !== player) {

    returnBase(card, player);

    if(playOrTake(player, card)) {
      // Check the base cards
      document.getElementById('hand_' + Number(!currentTurn)).classList.remove('active');
      currentTurn = player;
      document.getElementById('hand_' + Number(!currentTurn)).classList.add('active');

      openDeck.push(card);
      updateOpenDeck(card);

      players[player].Base.splice(baseIndex, 1);
      returnBase(card, player);
      updateBase(player, card, newBaseBottom, newBaseTop);

      // Card Rule (10)
      if (card.Weight === 10) {
        openDeck = [];
        let newCard = document.getElementById('newCard');
        newCard.src = "./media/img/cards/empty.png";

        document.getElementById('hand_' + Number(!currentTurn)).classList.remove('active');
        currentTurn = Number(!player);
        document.getElementById('hand_' + Number(!currentTurn)).classList.add('active');

      }
      // if 4 cards>same effect as 10
      if (openDeck.length >= 4) {
        if (openDeck[openDeck.length - 2].Weight === card.Weight
            && openDeck[openDeck.length - 3].Weight === card.Weight
            && openDeck[openDeck.length - 4].Weight === card.Weight) {
          openDeck = [];
          let newCard = document.getElementById('newCard');
          newCard.src = "./media/img/cards/empty.png";

          document.getElementById('hand_' + Number(!currentTurn)).classList.remove('active');
          currentTurn = Number(!player);
          document.getElementById('hand_' + Number(!currentTurn)).classList.add('active');
        }
      }
      updateDeck();
      if (players[player].Hand.length === 0 && players[player].Base.length === 0) {
        getPoints(player);
      }
    }
  }


};

// Split base cards to Topcards and Bottomcards
returnBase = (card, player) => {
  if(currentTurn === player) {

    // Create 2 arrays, top and bottom
    newBaseTop = players[player].Base.splice(3);
    newBaseBottom = players[player].Base;

    emptyBase(player);
    generateNewBase(card, player, newBaseBottom, newBaseTop);
    players[player].Base = players[player].Base.concat(newBaseTop);
  }
};

// Checks if you can play a card or have to take the pile of cards.
playOrTake = (player, card) => {
  let thisOpenDeckCard = openDeck[openDeck.length-1];

  // ALLES KAN OP NIKS
 if(openDeck.length === 0) {
   return true;
 }

 if(thisOpenDeckCard.Weight === 3 || thisOpenDeckCard.Weight === 0) {
   thisOpenDeckCard = openDeck[openDeck.length -2];
   if (openDeck.length === 1) {
     return true;
   }
   let filteredDeck = openDeck.filter((value, index, arr) => {
     return value.Value !== "Joker" && value.Value !== "3";
   });

   if (thisOpenDeckCard.Weight === 3 || thisOpenDeckCard.Weight === 0) {
     let reversedFilter = filteredDeck.reverse();
     if (reversedFilter.length === 0) {
       return true;
     }
     thisOpenDeckCard = reversedFilter[0];
   }
 }

 if(card.Deny.includes(thisOpenDeckCard.Value) && currentTurn !== player) {
   returnBase(card, player);

   // let baseIndex = players[player].Base.indexOf(card);
   let baseTopIndex = newBaseTop.indexOf(card);
   let baseBottomIndex = newBaseBottom.indexOf(card);

   let denied;
   // Bottom cards check
   if(players[player].Base.length <= 3 && currentTurn !== player) {

     openDeck.push(card);
     updateOpenDeck(card);

     newBaseBottom.splice(baseBottomIndex, 1);

     for (let o = 0; o < openDeck.length; o++) {
       players[player].Hand.push(openDeck[o]);
     }

     updateHand(player, card);
     returnBase(card, player);
     updateBase(player, card, newBaseBottom, newBaseTop);

     openDeck = [];
     document.getElementById('hand_' + Number(!currentTurn)).classList.remove('active');
     currentTurn = Number(player);
     document.getElementById('hand_' + Number(!currentTurn)).classList.add('active');
     newCard.src = "./media/img/cards/empty.png";

     return false;
   }
   // Check top cards
   if(players[player].Base.length >= 4 && currentTurn !== player) {
     denied = 0;
     returnBase(card, player);

     for (let i = 0; i < newBaseTop.length; i++) {
       if (newBaseTop[i].Deny.includes(thisOpenDeckCard.Value)) {
         denied += 1;
       }

       if (denied === newBaseTop.length) {
         denied = 0;

         openDeck.push(card);
         updateOpenDeck(card);
         newBaseTop.splice(baseTopIndex, 1);

         for (let y = 0; y < openDeck.length; y++) {
           players[player].Hand.push(openDeck[y]);
         }

         updateHand(player, card);
         returnBase(card, player);
         updateBase(player, card, newBaseBottom, newBaseTop);

         openDeck = [];
         document.getElementById('hand_' + Number(!currentTurn)).classList.remove('active');
         currentTurn = Number(player);
         document.getElementById('hand_' + Number(!currentTurn)).classList.add('active');
         newCard.src = "./media/img/cards/empty.png";
       }
     }
   }
   if(players[player].Hand.length > 0 && currentTurn !== player) {
     denied = 0;

     // Check if all cards cant be played
     for (let i = 0; i < players[player].Hand.length; i++) {
       if (players[player].Hand[i].Deny.includes(thisOpenDeckCard.Value)) {
         denied += 1;
       }

       if (denied === players[player].Hand.length) {
         denied = 0;

         for (let x = 0; x < openDeck.length; x++) {
           players[player].Hand.push(openDeck[x]);
         }

         updateHand(player, card);
         openDeck = [];

         document.getElementById('hand_' + Number(!currentTurn)).classList.remove('active');
         currentTurn = Number(player);
         document.getElementById('hand_' + Number(!currentTurn)).classList.add('active');
         newCard.src = "./media/img/cards/empty.png";
       }
     }
   }
   return false;
 } else {
   return true;
 }

};

// Deletes all HTML Elements from [PLAYER]'s Hand
emptyHand = (player) => {
  const hand = document.getElementById("hand_" + player);
  hand.innerHTML = "";
};

emptyBase = (player) => {
  const base = document.getElementById("base_" + player);
  base.innerHTML = "";
};

// Add new card to player hand (visually)
generateNewCard = (card, player) => {
  for (let i = 0; i < players[player].Hand.length; i++) {
      let hand = document.getElementById('hand_' + player);
      if(newHand !== 0) {
        hand.appendChild(cardUI(newHand[i], player));
      }
  }
};
// Put 6 new cards down on the board
generateNewBase = (card, player, bottomCards, topCards) => {
  // Add cards facing down to board
    if (topCards.length < 3) {
      for (let i = 0; i < bottomCards.length - topCards.length; i++) {
        let base = document.getElementById('base_' + player);
        if(bottomCards.length !== 0) {
          base.appendChild(cardUIBack(bottomCards[i], player));
        }
      }
    }

  // Add cards facing top to board
  if(topCards.length !== 0) {
    for (let i = 0; i < topCards.length; i++) {
      let base = document.getElementById('base_' + player);
      if(topCards.length !== 0) {
        base.appendChild(cardUI(topCards[i], player));
      }
    }
  }
};

// Adds all cards to hand if no card is able to be played.
updateHand = (player, card) => {
  newHand = players[player].Hand;
  emptyHand(player);
  generateNewCard(card, player);
  newHand = [];
};

updateBase = (player, card, bottomCards, topCards) => {
  newBase = players[player].Base;
  newBaseBottom = bottomCards;
  newBaseTop = topCards;
  emptyBase(player);
  generateNewBase(card, player, bottomCards, topCards);
  newBase = [];
};

// Updates the Image of the top Card on the open deck.
updateOpenDeck = (card) => {
  let newCard = document.getElementById('newCard');
  newCard.src = "./media/img/cards/" + (card.Suit + card.Value) + ".png";
};

// Update Deck.length & Opendeck.length count.
updateDeck = () => {
  document.getElementById('deckCount').innerHTML = deck.length;
  document.getElementById('newCardCount').innerHTML = openDeck.length;
};

getPoints = (player) => {
  if (players[player].Points === 0) {
    document.getElementById('points_' + player).innerHTML = "" + players[player].Points + "";
  }
  if (players[player].Hand.length === 0 && players[player].Base.length === 0) {
    players[player].Points++;
    document.getElementById('points_' + player).innerHTML = "" + players[player].Points + "";
    restartShithead(player);
  }
};
