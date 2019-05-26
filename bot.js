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
var msgAuthor = ""

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
      msg.channel.send("There is no ticket channel right now! An admin needs to create an input channel by doing `set` in a channel!")
      return;
    }

    if (msg.channel != ticketsChannel) {
      return;
    }

  if (!args[1]) {
      msg.channel.send("Please submit a valid ticket.")
      return;
    }

      msg.attachments.forEach(attachment => {
        return urll = attachment.url;
        return urll
      })

  if (msg.attachments.size > 0) {
    var messageArr = {content:msg.content, image:urll, age:dformat, author:`${msg.author}`, authorURL:msg.author.avatarURL, msgURL:msg.url, attachmentSize:msg.attachments.size, authorID: msg.author.id, authorTag:msg.author.username + "#"+ msg.author.discriminator}
    tickets.push(messageArr)
  }else{
    var messageArr = {content:msg.content, age:dformat, author:`${msg.author}`, authorURL:msg.author.avatarURL, msgURL:msg.url, authorID: msg.author.id, authorTag:msg.author.username + "#"+ msg.author.discriminator}
    tickets.push(messageArr)
  }

    msg.guild.createChannel(`ticket-support-${(tickets.slice(-1)[0]).authorTag}`, {type: 'text'})
    var latestChannel = msg.guild.channels.last()
    msgAuthor = msg.author
    msg.delete()

    var embedNewLog = new Discord.RichEmbed()
    .setTitle('New Ticket')
    .setAuthor(msg.author.username + "#"+ msg.author.discriminator, msg.author.avatarURL)
    .setDescription(msg.content)
    .setFooter(dformat)
    .setColor(0x008000)

  //  cChannel.send(embedNewLog)

    if (setLogs == false) {break;}
    logsChannel.send(embedNewLog)

    break;

    case "set":
    if (!msg.member.hasPermission('MANAGE_MESSAGES')) {
      msg.channel.send('You do not have permission to do this!')
      return;
    }
    setTickets = true

    ticketsChannel = msg.channel
    msg.channel.send("This channel will now be the ticket input channel!")

    if (setLogs == false) {break;}

    var embedSetLog = new Discord.RichEmbed()
    .setAuthor(msg.author.username + "#"+ msg.author.discriminator, msg.author.avatarURL)
    .setFooter(dformat)
    .setTitle(`Set input channel in #${ticketsChannel.name}`)
    .setDescription(msg.content)
    .setColor(0xFFFF00)

    logsChannel.send(embedSetLog)

    break;

    case "tickets":

    if (!msg.member.hasPermission('MANAGE_MESSAGES')) {
      msg.channel.send('You do not have permission to do this!')
      return;
    }

      if (tickets.length < 1) {
        msg.channel.send("There are no open tickets currently.")
        return;
      }

    var i = 0

  while (i != tickets.length) {
    if (tickets[i].attachmentSize > 0) {
    var embedTicketArrayText = new Discord.RichEmbed()
       .setTitle(`Ticket #${i}`)
       .setAuthor(tickets[i].author.tag, tickets[i].authorURL)
       .setDescription(tickets[i].content)
      // .addField('Original', `[Jump!](${tickets[i].msgURL})`)
       .setImage(tickets[i].image)
       .setFooter(`Ticket Created at ${tickets[i].age}`)
       .setColor(0xff0000)

       ticketsChannel.send(embedTicketArrayText)
     }else{
       var embedTicketArrayImage = new Discord.RichEmbed()
          .setTitle(`Ticket #${i + 1}`)
          .setAuthor(tickets[i].author.tag, tickets[i].authorURL)
          .setDescription(tickets[i].content)
    //      .addField('Original', `[Jump!](${tickets[i].msgURL})`)
          .setFooter(`Ticket Created at ${tickets[i].age}`)
          .setColor(0xff0000)

          ticketsChannel.send(embedTicketArrayImage)
        }
       i = i + 1
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

         if(!typeof currentTicket==='number' && !(currentTicket%1)===0) {
           msg.channel.send("Argument is not an integer")
           return;
         }

         try {
         var intTicket = parseInt(currentTicket)
         var intTicket = intTicket - 1
         var ticketString = tickets[intTicket].content

         tickets.splice(intTicket, 1);
         msg.channel.send(`Removed ticket #${currentTicket} - ${ticketString}`)

         if (setLogs == false) {break;}

         var embedNewLog = new Discord.RichEmbed()
         .setTitle('Cleared a ticket')
         .setAuthor(msg.author.username + "#"+ msg.author.discriminator, msg.author.avatarURL)
         .setDescription(msg.content)
         .addField('Ticket Cleared:', `${ticketString}`)
         .setFooter(dformat)
         .setColor(0xFF0000)

         logsChannel.send(embedNewLog)
       }

       catch (error){
         console.error(error)
       }
         break;

         case "clearall":

         if (!msg.member.hasPermission('MANAGE_MESSAGES')) {
           msg.channel.send('You do not have permission to do this!')
           return;
         }
         var logsRemoved = tickets.length
         tickets = [];
         msg.channel.send("Cleared all tickets")

         if (setLogs == false) {break;}

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

bot.on('channelCreate', channel => {

  if (!channel.name.startsWith("ticket-support-")) {return;}

  channel.overwritePermissions(channel.guild.roles.find(role => role.name === "@everyone"), {
     'VIEW_CHANNEL': false,                   'SEND_MESSAGES': false
  });
  channel.overwritePermissions(channel.guild.roles.find(role => role.name === "Support Team"), {
      'VIEW_CHANNEL': true,                   'SEND_MESSAGES': true,
  });

  channel.overwritePermissions(msgAuthor, {
      'VIEW_CHANNEL': true,                   'SEND_MESSAGES': true,
  });

channel.send(`<@${(tickets[tickets.length-1]).authorID}> has opened a new ticket with the following content:`)

if (tickets[tickets.length-1].attachmentSize > 0) {
var embedTicketArrayText = new Discord.RichEmbed()
   .setTitle(`Ticket #${tickets.length}`)
   .setAuthor(tickets[tickets.length-1].authorTag, tickets[tickets.length-1].authorURL)
   .setDescription(tickets[tickets.length-1].content)
//   .addField('Original', `[Jump!](${tickets[tickets.length-1].msgURL})`)
   .setImage(tickets[tickets.length-1].image)
   .setFooter(`Ticket Created at ${tickets[tickets.length-1].age}`)
   .setColor(0xff0000)

   channel.send(embedTicketArrayText)
 }else{
   var embedTicketArrayImage = new Discord.RichEmbed()
      .setTitle(`Ticket #${tickets.length}`)
      .setAuthor(tickets[tickets.length-1].authorTag, tickets[tickets.length-1].authorURL)
      .setDescription(tickets[tickets.length-1].content)
    //  .addField('Original', `[Jump!](${tickets[tickets.length-1].msgURL})`)
      .setFooter(`Ticket Created at ${tickets[tickets.length-1].age}`)
      .setColor(0xff0000)

      channel.send(embedTicketArrayImage)
    }
})

var twentyMins = 1000 * 60 * 20 // stops heroku from shutting down every 30 minutes
setInterval(function(){ // repeat this every 20 minutes
  var milliseconds = (new Date).getTime();
    console.log(milliseconds);
}, twentyMins)

bot.login(process.env.BOT_TOKEN);
