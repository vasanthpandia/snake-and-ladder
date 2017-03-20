var restify = require('restify');
var builder = require('botbuilder');
var Player = require('./player');
var Board = require('./board');

var players = {}
//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(3978, function () {
  console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//========================================================npm=
// Bots Dialogs
//=========================================================

bot.dialog('/', [
  function(session) {
    session.send("Messers Moony, Wormtail, Padfoot and Prongs welcome you to the Marauders' Bot");
    session.send("Welcome to Snake and Ladder");
    builder.Prompts.choice(session, "Select an option", ['View Board', 'New Game']);
  },
  function(session, results) {
    console.log(results);
    console.log(results);
    let choice = results.response.index;
    // date = results.entity;
    if (choice === 0) {
      // session.send("Messer Moony asks Snivellous to keep his greasy hair to himself");
      session.send(JSON.stringify(Board));
    } else {
      // session.send("Hello " + date);
      session.beginDialog('/newgame');
      // builder.Prompts.text(session, "Enter your name");
    }
  }
]);

bot.dialog('/newgame', [
  function(session) {
    session.send("You are starting a new game");
    builder.Prompts.text(session, "Enter your name");
  },
  function(session, results) {
    session.userData.name = results.response;
    session.send(`Welcome ${session.userData.name}`);
    var player1 = new Player(session.userData.name);
    var player2 = new Player('Computer');

    players[session.userData.name] = player1;
    players['computer'] = player2;

    session.send(`You are now playing against Computer`);
    session.beginDialog('/roll');
  }
]);

bot.dialog('/roll', [
  function(session) {
    builder.Prompts.choice(session, 'Select a choice to proceed', ['roll', 'quit']);
  },
  function(session, results) {
    if (results.response.index === 0) {
      if(session.userData.name) {
        let player = players[session.userData.name];

        playGame(session, player);

        if (player.lastRolled === 1) {
          session.send('You can roll again since you rolled 1');
          session.beginDialog('/roll');
        } else {
          session.beginDialog('/computer-turn');
        }
      }
    } else {
      session.beginDialog('/quit');
    }
  }
]);

bot.dialog('/computer-turn', [
  function(session) {
    session.send("Its computer's turn now.");
    let player = players['computer'];

    playGame(session, player)

    if (player.lastRolled === 1) {
      session.send('You can roll again since you rolled 1');
      session.beginDialog('/computer-turn');
    } else {
      session.beginDialog('/roll');
    }
  }
]);

bot.dialog('/quit', function(session) {
  session.send('Thank you for trying the game');
});

function playGame(session, player) {
  player.rollDice();
  session.send(`You rolled ${player.lastRolled}`);
  session.send(`Your new position is ${player.position}`);
  let gameOutput = player.followBoard();

  session.send(JSON.stringify(gameOutput));

  if (gameOutput.result === 'snake') {
    session.send(`Ouch..! Bitten by a snake at ${gameOutput.from}. Now at ${player.position}`);
  } else if (gameOutput.result === 'ladder') {
    session.send(`Woohoo! Moving up the ladder from ${gameOutput.from} to ${player.position}`);
  } else if (gameOutput.result === 'You Win!') {
    if (player.name != 'Computer') {
      session.send(`${player.name} has won! Congratulations`)
    } else {
      session.send('You lose!');
    }
    session.beginDialog('/quit');
  }
}
