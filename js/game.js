let difficulty = localStorage.getItem("difficulty") || 0;
let backs = localStorage.getItem("backs") || 0;
let wrapper = document.querySelector(".wrapper");
let message = document.querySelector(".message");

//timer
let time;

function startTimer(duration, display) {
  var timer = duration,
    minutes, seconds;
  setInterval(function() {
    minutes = parseInt(timer / 60, 10)
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;
    time = duration - timer;

    if (--timer < 0) {
      message.querySelector('.lose').classList.add('show');
      message.classList.add("show");
    }
  }, 1000);
}

window.onload = function() {
  var gameTime = 60 * 3,
    display = document.querySelector('#time');
  startTimer(gameTime, display);
};

//cards classes
class Card {
  constructor(value, index) {
    this.value = value;
    this.index = index;
  }
}

Card.prototype.back = backs;
Card.prototype.toString = function cardToString() {
  let myString = this.value;
  return myString;
}

Card.prototype.drawCard = (index) => {
  let section = document.createElement('section');
  section.classList.add("container");
  section.classList.add('difficulty' + difficulty);
  let div = document.createElement('div');
  div.classList.add('card');
  let front = document.createElement('figure');
  front.classList.add('front' + cards[index].value);
  let back = document.createElement('figure');
  back.classList.add('back' + backs);

  wrapper.appendChild(section);
  section.appendChild(div);
  div.appendChild(front);
  div.appendChild(back);
  return div;
}

class CardEasy {
  constructor(value, index) {
    this.value = value;
    this.index = index;
    this.level = "easy";
  }
}
CardEasy.prototype.__proto__ = Card.prototype;
CardEasy.prototype.level = "easy";

class CardMedium {
  constructor(value, index) {
    this.value = value;
    this.index = index;
  }
}
CardMedium.prototype.__proto__ = Card.prototype;
CardMedium.prototype.level = "medium";

class CardHard {
  constructor(value, index) {
    this.value = value;
    this.index = index;
  }
}
CardHard.prototype.__proto__ = Card.prototype;
CardHard.prototype.level = "hard"

//before the game started
var quantity;
switch (difficulty) {
  case '1':
    quantity = 18;
    break;

  case '2':
    quantity = 24;
    break;

  default:
    quantity = 10;
    break;
}


var cards = [];
let number = 0;

for (var i = 0; i < quantity / 2; i++) {
  let tempCard1 = number,
    tempCard2 = number;
  cards.push(tempCard1);
  cards.push(tempCard2);
  number++;
}


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

shuffleArray(cards);

//resuts
results = function(tempTime) {
  let level;
  var record = {
    firstName: localStorage.getItem("firstName"),
    lastName: localStorage.getItem("lastName"),
    time: tempTime
  };
  if (cards[0].level == "easy") {
    level = 'recordsEasy';
  }
  if (cards[0].level == "medium") {
    level = 'recordsMedium';
  }
  if (cards[0].level == "hard") {
    level = 'recordsHard';
  }

  let previousRecords = localStorage.getItem(level);
  
  if (previousRecords == null) {
    previousRecords = [];
    previousRecords.push(record);
  } else {
    //previousRecords 
    //while(previousRecords.length>10)
    previousRecords = JSON.parse(previousRecords);

    let i = previousRecords.length-1;
    for(;i>-1;i--) {
      if(previousRecords[i].time < tempTime)break;
    }
    if (-1 < i < 9) {
      for (let j = (previousRecords.length>9)?9:previousRecords.length; j > i+1; j--) {
        previousRecords[j] = previousRecords[j - 1];
      }
      previousRecords[i+1] = record;
    }
  }
  let recordslist=document.querySelector(".records").querySelectorAll("li");
  for(let i=0; i<previousRecords.length; i++){
    recordslist[i].textContent=previousRecords[i].firstName+" "+previousRecords[i].lastName+" "+previousRecords[i].time;
  }
  previousRecords = JSON.stringify(previousRecords);
  localStorage.setItem(level, previousRecords);
}

//flip function
var previousCard = [-1, -1];

flip = function() {
  //!!!если не получается отгадать карты раскомментируйте следующую строку: так будет показываться номер карты
  //alert(this.ref.value);

  this.classList.toggle('flipped');
  if (previousCard[0] == -1) {
    previousCard[0] = this.ref.value;
    previousCard[1] = this.ref.index;
  } else {
    if (previousCard[0] == this.ref.value && previousCard[1] != this.ref.index) {
      previousCard[0] = -1;
      let index = this.ref.index;
      quantity -= 2;
      setTimeout(function() {
        cards[index].elem.classList.add('hidden');
        cards[previousCard[1]].elem.classList.add('hidden');
      }, 500);
      if (quantity < 1) {
      setTimeout(function() {
        message.querySelector('.win').classList.add('show');
        message.classList.add("show");
      }, 1000);
        results(time);
      }
    } else {
      previousCard[0] = -1;
      let index = this.ref.index;
      setTimeout(function() {
        cards[previousCard[1]].elem.classList.toggle('flipped');
        cards[index].elem.classList.toggle('flipped');
      }, 500);
    }
  }
}

//game itself
switch (difficulty) {
  case '1':
    for (let i = 0; i < quantity; i++) {
      cards[i] = new CardMedium(cards[i], i);
      cards[i].elem = cards[i].drawCard(i);
      cards[i].elem.ref = cards[i];
      cards[i].elem.addEventListener('click', flip);
    }
    break;

  case '2':
    for (let i = 0; i < quantity; i++) {
      cards[i] = new CardHard(cards[i], i);
      cards[i].elem = cards[i].drawCard(i);
      cards[i].elem.ref = cards[i];
      cards[i].elem.addEventListener('click', flip, false);
    }
    break;

  default:
    for (let i = 0; i < quantity; i++) {
      cards[i] = new CardEasy(cards[i], i);
      cards[i].elem = cards[i].drawCard(i);
      cards[i].elem.ref = cards[i];
      cards[i].elem.addEventListener('click', flip, false);
    }
    break;
}