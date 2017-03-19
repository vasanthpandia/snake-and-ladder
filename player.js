const board = require('./board');

let Player = function(name) {
  this.name = name;
  this.position = null;
  this.lastRolled = null;
  this.rollDice = function() {
    this.lastRolled = Math.floor(Math.random()*(13-1)) + 1;
    console.log("You rolled ", value);
    if (this.position) {
      this.position += this.lastRolled
    } else if (value === 1) {
      this.position = this.lastRolled;
      console.log("Good Luck! Now you're on board. Climb the ladders and watch out for snakes");
    }
  };
  this.followBoard = function() {
    const initialPosition = this.position;

    if (this.position in board.snakes) {
      this.position = board.snakes[this.position];
      return { result: 'snake', from: initialPosition }
    } else if (this.position in board.ladders) {
      this.position = board.ladders[this.position];
      return { result: `ladder`, from: initialPosition }
    } else {
      return { result: 'Keep rolling.' }
    }
  }
};

module.exports = Player;
