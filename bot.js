const Discord = require('discord.js');
const config = require('./config.json')
const bot = new Discord.Client();

bot.on('ready', () => {
 console.log(`Logged in as ${bot.user.tag}!`);
 });

 bot.on('ready', () => {
   bot.user.setActivity("Establishing gulags")
 })

bot.on('error', console.error);

bot.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
});


bot.login(config.token);
