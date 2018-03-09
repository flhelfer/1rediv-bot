// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`on ${client.guilds.size} servers`);
});


client.on("presence", (userold, usernew) => {
    console.log("Presence Changed!");
});


client.on('presence', (user, status, gameId) => {
  console.log('presence', user, status, gameId);
});

client.on('presenceUpdate', (oldMember, newMember) => {
    
    
    if(newMember.user.presence.game != null){
        
        
        console.log(`${newMember.user.username} commence ${newMember.user.presence.game.name}`);
        if(newMember.user.presence.game.name.indexOf('Total War: Arena') > -1 ){
            var roleTotal = newMember.guild.roles.find('name', 'Joueur Total')
            newMember.addRole(roleTotal);
           console.log('Add role');
           }
        
        if(newMember.user.presence.game.name ==='Foxhole'){
            var roleTotal = newMember.guild.roles.find('name', 'Joueur Foxhole')
            newMember.addRole(roleTotal);
           console.log('Add role');
           }
        if(newMember.user.presence.game.name.indexOf('Spotify') > -1){
            console.log('wouaaai');
               var roleFoxhole = newMember.guild.roles.find('name', 'Musicien')
            newMember.addRole(roleFoxhole);
                    console.log('wessssh');
           }
        if(newMember.user.presence.game.name.indexOf('War Thunder') > -1){
            console.log('wouaaai');
               var roleFoxhole = newMember.guild.roles.find('name', 'Joueur War Thunder')
            newMember.addRole(roleFoxhole);
                    console.log('wessssh');
           }
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
  
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
    
    if(command === "game") {
          console.log('coucouuuuu');
          
        //message.channel.send('wesh'+message.author.username+':'+message.author.presence.game.name);
        message.guild.fetchMember(message.author)
  .then(member => {
            updateGameRoleNumber(member);
    
            
  });
        
        console.log('coucouuuuu');
    
  }
   
});

function updateGameRoleNumber(member){
    var numberGames = 0;
    member.roles.array().forEach(function(item, index, array) {
        if(item.name.indexOf('Joueur') > -1){
            numberGames++;
            console.log(item.name);
        }
        if(item.name.indexOf('jeux') > -1){
            console.log('remove');
           member.removeRole(item.id);
           }
});
    member.addRole(member.guild.roles.find('name', numberGames+' jeux'));
}



client.login(config.token);
