var restify = require('restify');
var builder = require('botbuilder');

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

    builder.Prompts.text(session, 'Reveal yourselves!');
  },
  function(session, results) {
    console.log(results);
    name = results.response;
    if (name === 'Snape') {
      session.send("Messer Moony asks Snivellous to keep his greasy hair to himself");
    } else {
      session.send("Hello " + results.response);
    }
  }
]);
