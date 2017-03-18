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

    // builder.Prompts.text(session, 'Reveal yourselves!');
    // builder.Prompts.choice(session, "Select your gender", ['male', 'female', 'neutral']);
    // builder.Prompts.attachment(session, "Send me your picture");
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
  function(session, next) {
    if !(session.userData.name) {
      session.send("You are starting a new game");
      builder.Prompts.text(session, "Enter your name");    
    } else {
      next();
    }
  },
  function(session, results) {
    session.userData.name = results.response;
    session.send(`Welcome ${session.userData.name}`);
    var player1 = new Player(session.userData.name);
    var player2 = new Player('Computer');

    players[session.userData.name] = player1;
    players['computer'] = player2;

    session.send(`You are now playing against ${session.userData.opponent.name}`);
    builder.Prompts.text(session, "Type 'roll' to roll dice.");
  },
  function(session, results) {
    console.log(session);
    console.log(results);

    players[session.userData.name].rollDice();
    session.send("Hello");
  }
])
