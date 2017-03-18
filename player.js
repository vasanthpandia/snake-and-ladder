const Board = require('./board');

let Player = function(name) {
  this.name = name;
  this.position = null;
  this.rollDice = function() {
    value = Math.floor(Math.random()*(13-1)) + 1;
    console.log("You rolled ", value);
    if (this.position) {
      this.position += value
    } else if (value === 1) {
      this.position = value;
      console.log("Good Luck! Now you're on board. Climb the ladders and watch out for snakes");
    }
  }
};

module.exports = Player;
