// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values.
const config = require("./package.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.



client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`by PedoBear_Inc`);
});

client.on('presenceUpdate', (oldMember, newMember) => {

    console.log(oldMember.nickname);
    if(newMember.user.presence.game != null){
        console.log(`${newMember.user.username} commence ${newMember.user.presence.game.name}`);
        updateGameRole(newMember);
        //updateName(newMember);
       }else{
          console.log(`${oldMember.user.username} ne joue plus`);
       }
});

client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Let's go with a few common example commands! Feel free to delete or change those.

  if(command === "pong") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)

  client.users.array().forEach(function(item, index, array) {
    console.log("["+item+"] "+item.username+":"+item.id);
  });

  var semper = message.guild.members.get("137167492404477962");

  updateName(semper);

    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }


  if(command === "update") {

	   message.guild.fetchMember(message.author)
   .then(member => {
	   config.gamelist.forEach(function(entry) {
     console.log(entry[0]+"gamelist");

          member.guild.roles.forEach(function(r){
            console.log(r.name+"+++"+entry[0]);
            if(r.name.indexOf(entry[0]) !== -1){
              //add a game
              member.addRole(role);
              console.log('its a match!'+r.name+"->"+member.nick+entry[1]);
              //updateName(member, entry[1]);

              //add role + change nick
            }
          });
   });
 });
		message.guild.fetchMember(message.author).then(member => {
			member.roles.array().forEach(function(item, index, array) {
				console.log(item.name);
				updateGameRoleNumber(member);
			});
		});
  }

  if(command === "help") {
	  message.channel.send("+ping pour voir la latence du bot.");
	  message.channel.send("+update pour mettre à jour ton nombre de jeux.");
	  message.channel.send("+game pour ajouter ton jeu s'il n'est pas déjà dans ta liste de rôle.");
  }


  // if(command === "name") {
	//   message.guild.fetchMember(message.author).then(member => {
	// 		updateName(member);
	// 	});
  // }



});

//A implémenter dans le futur
function updateName(member, addon){
  console.log(member.displayName+':Cool Name');
  member.setNickname(member.displayName+addon);
}

function updateGameRole(member){

  config.gamelist.forEach(function(entry) {
  console.log(entry[0]+"gamelist");
  if(member.user.presence.game.name.indexOf(entry[0]) > -1){
    console.log('add!'+member.user.presence.game.name+"->"+member.name);
    member.guild.roles.forEach(function(r){
      if(r.name.indexOf(entry[0]) !== -1){
        member.addRole(r);
        console.log('its a match!'+r.name+"->"+member.user.username+entry[1]);
        //updateName(member, entry[1]);

        //add role + change nick
      }
    });

    updateGameRoleNumber(member);
  }
});

}

function updateGameRoleNumber(member){
    var numberGames = 0;
    member.roles.array().forEach(function(item, index, array) {
        if(isAGame(item.name)){
            numberGames++;
        }
        if(item.name.indexOf('jeux') > -1){
            console.log('remove');
           member.removeRole(item.id);
           }
});

console.log("finale numbergame:"+numberGames);
    member.addRole(member.guild.roles.find('name', numberGames+' jeux'));
}


function isAGame(str) {
	var ok = false;
    toUTF8Array(str).forEach(function(item, index, array) {
		ok=false;
		if(item===174){
			ok=true;
		}
	});
	return ok;

	// 240+159+142+174
}

function toUTF8Array(str) {
    var utf8 = [];
    for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6),
                      0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12),
                      0x80 | ((charcode>>6) & 0x3f),
                      0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                      | (str.charCodeAt(i) & 0x3ff))
            utf8.push(0xf0 | (charcode >>18),
                      0x80 | ((charcode>>12) & 0x3f),
                      0x80 | ((charcode>>6) & 0x3f),
                      0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
}



client.login(config.token);
