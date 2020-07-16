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

var prefix = ">>"

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
const talkedRecently = new Set();


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

  if (talkedRecently.has(msg.author.id)) {
      msg.channel.send("Wait 10 minutes before opening up a new ticket - " + msg.author)
    .then(msg => {
    msg.delete(10000)
  })
  .catch(console.log("Message did not send"));
   } else {

     talkedRecently.add(msg.author.id);
     setTimeout(() => {
       talkedRecently.delete(msg.author.id);
     }, 600000);

  if (setTickets == false) {
      msg.channel.send("There is no ticket channel right now! An admin needs to create an input channel by doing `set` in a channel!")
      return;
    }

    if (msg.channel != ticketsChannel) {
      return;
    }

  if (!args[1]) {
      msg.channel.send("Please submit a valid ticket. Describe what happened.")
      return;
    }

      msg.attachments.forEach(attachment => {
        return urll = attachment.url;
        return urll
      })

  if (msg.attachments.size > 0) {
    var messageArr = {content:msg.content, image:urll, age:dformat, author:msg.author, authorURL:msg.author.avatarURL, msgURL:msg.url, attachmentSize:msg.attachments.size, authorTag:msg.author.username + "#"+ msg.author.discriminator}
    tickets.push(messageArr)
  }else{
    var messageArr = {content:msg.content, age:dformat, author:msg.author, authorURL:msg.author.avatarURL, msgURL:msg.url, authorTag:msg.author.username + "#"+ msg.author.discriminator}
    tickets.push(messageArr)
  }

    msg.guild.createChannel(`${tickets.length}-ticket-${(tickets.slice(-1)[0]).authorTag}`, {type: 'text'})
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

}

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
    msg.channel.send("This channel is now the ticket input channel!")

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
       .setAuthor(tickets[i].authorTag, tickets[i].authorURL)
       .setDescription(tickets[i].content)
      // .addField('Original', `[Jump!](${tickets[i].msgURL})`)
       .setImage(tickets[i].image)
       .setFooter(`Ticket Created at ${tickets[i].age}`)
       .setColor(0xff0000)

       msg.channel.send(embedTicketArrayText)
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
         .setTitle('ping')
         .setAuthor('Information')
         .setColor(0xDF1212)
         .setDescription('Returns your ping')
         .setFooter('RogueMC Ticketer')
         .addField('set', 'Sets the ticket output channel')
         .addField('new {describe what happened}', 'Create a ticket')
         .addField('tickets', 'View all ongoing tickets')
         .addField('close {ticket number} OR close in the channel you want to close', 'Remove a ticket')
         .addField('clearall', 'Clear all tickets')
         .addField('log', 'Sets the ticket logging output channel')

         msg.channel.send(embedHelp)

         break;

         case "close":
         if (!msg.member.hasPermission('MANAGE_MESSAGES')) {
           msg.channel.send('You do not have permission to do this!')
           return;
         }

         var closeChan = ""
         var ticketNum = ""
         var ticketNumCheck = msg.channel.name.charAt(1);

         if (!args[1]) {
           if (tickets[tickets.length-1] == 0) {return;}

           if (ticketNumCheck != "-") {
             closeChan = msg.channel.name.slice(2);
             ticketNum = msg.channel.name.slice(2);

             if (msg.channel.type == "text" && closeChan.startsWith("-ticket-")) {
               msg.channel.delete("Ticket closed")
               var intTicket = parseInt(ticketNum)
               var intTicket = intTicket - 1
               tickets.splice(intTicket, 1);

               var h = 0
               while (h != tickets.length) {
                 h = h + 1
                 tickets[h-1].cChannel.edit({ name: `${h}-ticket-${tickets[h-1].authorTag}` })
              }
           }

           }else{
             closeChan = msg.channel.name.substr(1);
             ticketNum = msg.channel.name.charAt(0);
             if (msg.channel.type == "text" && closeChan.startsWith("-ticket-")) {
               msg.channel.delete("Ticket closed")
               var intTicket = parseInt(ticketNum)
               var intTicket = intTicket - 1
               tickets.splice(intTicket, 1);

               var h = 0
               while (h != tickets.length) {
                 h = h + 1
                 tickets[h-1].cChannel.edit({ name: `${h}-ticket-${tickets[h-1].authorTag}` })
              }
           }
       }
       break;
     }

         if(!typeof currentTicket==='number' && !(currentTicket%1)===0) {
           msg.channel.send("Argument is not an integer")
           return;
         }

         try {
         var intTicket = parseInt(currentTicket)
         var intTicket = intTicket - 1
         var ticketString = tickets[intTicket].content

         tickets[intTicket].cChannel.delete()

         tickets.splice(intTicket, 1);
         msg.channel.send(`Removed ticket #${currentTicket} - ${ticketString}`)
         var h = 0
          while (h != tickets.length) {
            h = h + 1
            tickets[h-1].cChannel.edit({ name: `${h}-ticket-${tickets[h-1].authorTag}` })
         }

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
         var tn = 0

         while (tn != tickets.length) {
            tickets[tn].cChannel.delete('Clear all command')
            tn = tn + 1
         }
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

  var ticketNumCheck = channel.name.charAt(1);

  if (ticketNumCheck != "-") {
    closeChan = channel.name.slice(2);
  } else {
    var closeChan = channel.name.substr(1);
  }

  if (!closeChan.startsWith("-ticket-")) {return;}

  tickets[tickets.length-1].cChannel = channel

  channel.overwritePermissions(channel.guild.roles.find(role => role.name === "@everyone"), {
     'VIEW_CHANNEL': false,                   'SEND_MESSAGES': false
  });
  channel.overwritePermissions(channel.guild.roles.find(role => role.name === "lol"), {
      'VIEW_CHANNEL': true,                   'SEND_MESSAGES': true,
  });

  channel.overwritePermissions(msgAuthor, {
      'VIEW_CHANNEL': true,                   'SEND_MESSAGES': true,
  });

channel.send(`<@${(tickets[tickets.length-1]).author.id}> has opened a new ticket with the following content:`)

if (tickets[tickets.length-1].attachmentSize > 0) {
var embedTicketArrayText = new Discord.RichEmbed()
   .setTitle(`Ticket`)
   .setAuthor(tickets[tickets.length-1].authorTag, tickets[tickets.length-1].authorURL)
   .setDescription(tickets[tickets.length-1].content)
//   .addField('Original', `[Jump!](${tickets[tickets.length-1].msgURL})`)
   .setImage(tickets[tickets.length-1].image)
   .setFooter(`Ticket Created at ${tickets[tickets.length-1].age}`)
   .setColor(0xff0000)

   channel.send(embedTicketArrayText)
 }else{
   var embedTicketArrayImage = new Discord.RichEmbed()
      .setTitle(`Ticket`)
      .setAuthor(tickets[tickets.length-1].authorTag, tickets[tickets.length-1].authorURL)
      .setDescription(tickets[tickets.length-1].content)
    //  .addField('Original', `[Jump!](${tickets[tickets.length-1].msgURL})`)
      .setFooter(`Ticket Created at ${tickets[tickets.length-1].age}`)
      .setColor(0xff0000)

      channel.send(embedTicketArrayImage)
    }
})

var twentyMins = 1000 * 60 * 20 // stops heroku from shutting down every 30 minutes
setInterval(function(){
  var milliseconds = (new Date).getTime();
    console.log(milliseconds);
}, twentyMins)


bot.login(process.env.BOT_TOKEN);
