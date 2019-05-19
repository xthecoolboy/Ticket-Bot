const Discord = require('discord.js');
const bot = new Discord.Client();

bot.on('ready', () => {
 console.log(`Logged in as ${bot.user.tag}!`);
 });

 bot.on('ready', () => {
   bot.user.setActivity("RogueMC.net")
 })

bot.on('error', console.error);

bot.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
});

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

var prefix = "-"

bot.on('message', message => {
  var args = message.content.substring(prefix.length).split(" ");
    if (message.isMentioned(bot.user) && !(args[1]) && !(args[2]) && !(args[3])) {
    message.reply('Prefix is `' + prefix + "`");
  }
})

var d = new Date,
    dformat = [d.getMonth()+1,
    d.getDate(),
    d.getFullYear()].join('/')+' '+
    [d.getHours(),
    ('0'+d.getMinutes()).slice(-2),
    ('0'+d.getSeconds()).slice(-2)].join(':');

var logsChannel = ""
var ticketsChannel = ""
var setTickets = false
var setLogs = false
var tickets = []
// _____________________________________________________________________________

bot.on('message', msg => {
    if (msg.author.equals(bot.user)) return;
    if (!msg.content.startsWith(prefix)) return;

    var args = msg.content.substring(prefix.length).split(" ");
    var currentTicket = args[1]

    switch (args[0]) {

    case "ping":
	   var embedPing = new Discord.RichEmbed()
	    .setTitle(`Pong! 🏓`)
	    .setFooter('RogueMC Ticketer')
	    .setColor(getRandomColor())
	    .setDescription(Math.round(bot.ping) + ' ms');
	msg.channel.send(embedPing);
	break;

  case "new":

  if (setTickets == false) {
      msg.channel.send("I have nowhere to send out the tickets! An admin needs to do so by saying `-set` in staff channel.")
      return;
    }

    if (!args[1]) {
      msg.channel.send("Please submit a valid ticket.")
      return;
    }

    msg.channel.send("Ticket Created")

    var embedTicket = new Discord.RichEmbed()
    .setTitle('New Ticket')
    .setAuthor(msg.author.username + "#"+ msg.author.discriminator, msg.author.avatarURL)
    .setDescription(msg.content)
    .setFooter(dformat)
    .setColor(getRandomColor())

    ticketsChannel.send(embedTicket)

    tickets.push(`${msg.author.tag}: ${msg.content}`)

    if (setLogs == false) {return;}

    var embedNewLog = new Discord.RichEmbed()
    .setTitle('New Ticket')
    .setAuthor(msg.author.username + "#"+ msg.author.discriminator, msg.author.avatarURL)
    .setDescription(msg.content)
    .setFooter(dformat)
    .setColor(0x008000)

    logsChannel.send(embedNewLog)

    break;

    case "set":
    if (!msg.member.hasPermission('MANAGE_MESSAGES')) {
      msg.channel.send('You do not have permission to do this!')
      return;
    }
    setTickets = true

    ticketsChannel = msg.channel
    msg.channel.send("Tickets will now appear in this channel.")

    if (setLogs == false) {return;}

    var embedSetLog = new Discord.RichEmbed()
    .setAuthor(msg.author.username + "#"+ msg.author.discriminator, msg.author.avatarURL)
    .setFooter(dformat)
    .setTitle(`Set output channel in #${ticketsChannel.name}`)
    .setDescription(msg.content)
    .setColor(0xFFFF00)

    logsChannel.send(embedSetLog)

    break;

    case "tickets":
      if (tickets.length < 1) {
        msg.channel.send("There are no open tickets currently.")
        return;
      }
      var countt = 0
      while (countt != tickets.length) {
        var countt = countt + 1
      ticketsChannel.send(`${countt}. ` + tickets[countt-1])
    }
    break;

    case "help":
    var embedHelp = new Discord.RichEmbed()
         .setTitle('Ping')
         .setAuthor('Information')
         .setColor(0xDF1212)
         .setDescription('Returns your ping')
         .setFooter('RogueMC Ticketer')
         .addField('set', 'Sets the ticket output channel')
         .addField('new {describe what happened}', 'Create a ticket')
         .addField('tickets', 'View all ongoing tickets')
         .addField('close {ticket number}', 'Remove a ticket')
         .addField('clearall', 'Clear all tickets')
         .addField('log', 'Sets the ticket logging output channel')

         msg.channel.send(embedHelp)

         break;

         case "close":
         if (!msg.member.hasPermission('MANAGE_MESSAGES')) {
           msg.channel.send('You do not have permission to do this!')
           return;
         }

         if (!args[1]) {
           msg.channel.send("Please enter a valid ticket number")
           return;
         }

         if(!typeof currentTicket==='number' && (currentTicket%1)===0) {
           msg.channel.send("Argument is not an integer")
           return;
         }
         var intTicket = parseInt(currentTicket)
         var intTicket = intTicket - 1
         var ticketString = tickets[intTicket]

         tickets.splice(intTicket, 1);
         msg.channel.send(`Removed ticket #${currentTicket} - ${ticketString}`)

         if (setLogs == false) {return;}

         var embedNewLog = new Discord.RichEmbed()
         .setTitle('Cleared a ticket')
         .setAuthor(msg.author.username + "#"+ msg.author.discriminator, msg.author.avatarURL)
         .setDescription(msg.content)
         .addField('Ticket Cleared:', `${ticketString}`)
         .setFooter(dformat)
         .setColor(0xFF0000)

         logsChannel.send(embedNewLog)

         break;

         case "clearall":

         if (!msg.member.hasPermission('MANAGE_MESSAGES')) {
           msg.channel.send('You do not have permission to do this!')
           return;
         }
         var logsRemoved = tickets.length
         tickets = [];
         msg.channel.send("Cleared all tickets")

         if (setLogs == false) {return;}

         var embedClearLog = new Discord.RichEmbed()
         .setAuthor(msg.author.username + "#"+ msg.author.discriminator, msg.author.avatarURL)
         .setFooter(dformat)
         .setTitle(`Cleared Logs (${logsRemoved} items)`)
         .setDescription(msg.content)
         .setColor(0xFFA500)

         logsChannel.send(embedClearLog)

         break;

         case "log":
         if (!msg.member.hasPermission('MANAGE_MESSAGES')) {
           msg.channel.send('You do not have permission to do this!')
           return;
         }
         setLogs = true
         logsChannel = msg.channel

         msg.channel.send('Ticket logs will now appear in this channel')
         break;
  }
})

bot.login(process.env.BOT_TOKEN);
