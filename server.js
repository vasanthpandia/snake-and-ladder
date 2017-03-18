var restify = require('restify');
var builder = require('botbuilder');
var Player = require('./player');
var Board = require('./board');

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
      builder.Prompts.text(session, "Enter your name");
    }
  }
]);
