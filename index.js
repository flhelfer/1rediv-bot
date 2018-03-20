// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`,
// or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix
// values.
const config = require("./package.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

// id serveur test: 420652493836517386
// id sempeur: 137167492404477962

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  // Example of changing the bot's playing game to something useful.
  // `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`by PedoBear_Inc`);
});

try {
  client.on('presenceUpdate', (oldMember, newMember) => {

    console.log(oldMember.nickname);
    if (newMember.user.presence.game != null) {
      console.log(`${newMember.user.username} commence ${newMember.user.presence.game.name}`);
      newMember.guild.roles.forEach(function(r) {
        console.log(r.name + "WESH");
        if (r.name.indexOf(newMember.user.presence.game.name) !== -1) {
          newMember.addRole(r);
          console.log('its a match!!!!!!!!!!!!!!!!!!' + r.name + "->" + newMember.user.username);
        } else {
          console.log("NOT A MATCH" + newMember.user.presence.game.name + ":" + r.name);
        }
      });
    } else {
      //No game presence detected.
      console.log(`${oldMember.user.username} ne joue plus`);
    }
  });
} catch (e) {
  console.log('Catched an error' + e.stack);
}

client.on("message",
  async message => {
    // This event will run on every single message received, from any channel or DM.

    // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
    if (message.author.bot) return;

    // Also good practice to ignore any message that does not start with our prefix,
    // which is set in the configuration file.
    if (message.content.indexOf(config.prefix) !== 0) return;

    // Here we separate our "command" name, and our "arguments" for the command.
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Let's go with a few common example commands! Feel free to delete or change those.

    if (command === "guilds") {
      //Return the server where the bot is connected
      client.guilds.array().forEach(function(item, index, array) {
        console.log("[" + item + "] " + item.name + ":" + item.id);
      });
    }


    if (command === "ping") {
      // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
      // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
      const m = await message.channel.send("Ping?");
      m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
    }

    if (command === "test") {

    }

    if (command === "update")

    {
      //will be implemented so the user can "reset" his roles.
    }

    if (command === "help") {
      message.channel.send("+ping pour voir la latence du bot.");
      message.channel.send("+update pour mettre à jour tes rôles");
    }

  });
client.login(config.token);