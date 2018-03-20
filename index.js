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
      if (newMember.nickname != null) {
        var userGames = detectGameRoles(newMember.nickname);
        if (userGames != null) {
          userGames.forEach(function(userGame) {
            if (newMember.user.presence.game.name.indexOf(userGame[0]) !== -1) {
              console.log('Game already added!');
            } else {
              console.log("It's a new game!");
              updateGameRole(newMember, userGames);
            }
          });
        } else {
          console.log('No games yet');
        }
      } else {
        //If the user doesnt have a nickname yet we give him his username as nickname
        newMember.setNickname(newMember.user.username);
        var userGames = detectGameRoles(newMember.nickname);
        if (userGames != null) {
          userGames.forEach(function(userGame) {
            if (newMember.user.presence.game.name.indexOf(userGame[0]) !== -1) {
              console.log('Game already added!');
            } else {
              console.log("It's a new game!");
              updateGameRole(newMember, userGames);
            }
          });
        } else {
          console.log('No games yet');
        }
      }
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
      //Test area
      var semper = message.guild.members.get("137167492404477962");

      var list = [
        ["Foxhole", "🛠", "240159155160", 1],
        ["Total War: Arena", "⚔️", "226154148", 1],
        ["War Thunder", "⚙", "226154153", 0]
      ];
      updateGameRole(semper, list);
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

//This function is used to update the roles AND the icons of the user
function updateGameRole(member, memberGamesList) {
  try {
    // Go trough all the gameList
    config.gamelist.forEach(function(entry) {
      console.log(entry[0] + "->gamelist");
      //If there is a match between the game playing and the gameList
      if (member.user.presence.game.name.indexOf(entry[0]) > -1) {
        console.log('add!' + member.user.presence.game.name + "->" + member.user.username);
        member.guild.roles.forEach(function(r) {
          if (r.name.indexOf(entry[0]) !== -1) {
            member.addRole(r);
            memberGamesList.push(entry);
            console.log('its a match!' + r.name + "->" + member.user.username + entry[1])
          }
        });

        var tempNickname = removeEmojis(member.nickname);

        //Test if the user has enough offials game to give him the role.
        if (updateGameRoleOfficial(member)) {
          member.addRole();
        }

        member.roles.array().forEach(function(item, index, array) {
          console.log('STAFF' + item.name);
          config.staffroles.forEach(function(staffrole) {
            if (item.name.indexOf(staffrole[0]) !== -1) {
              console.log('ADDD EMOOOOOJI STAFF' + staffrole[0]);
              if (staffrole[3] === 0) {
                console.log(staffrole[0] + 'ADDD EMOOOOOJI STAFF');
                tempNickname = staffrole[1] + tempNickname;
              } else {
                tempNickname = tempNickname + staffrole[1];
              }
            } else {
              console.log('NOT ADDD EMOOOOOJI STAFF' + staffrole[0]);
            }
          });
        });

        memberGamesList.forEach(function(memberGame) {
          config.gamelist.forEach(function(gameList) {
            if (memberGame === gameList) {
              console.log('ADDD EMOOOOOJI' + memberGame[0]);
              tempNickname = tempNickname + memberGame[1];
            } else {
              console.log('NOT ADDD EMOOOOOJI' + memberGame[0]);
            }
          });
        });
        member.setNickname(tempNickname, function(error) {
          if (error) {
            console.log(tempNickname + "-----" + error);
          } else {
            console.log("done!");
          }
        });
      }
    });
  } catch (err) {
    console.log("Not playing");
  }

}

function updateGameRoleNumber(member) {
  var numberGames = 0;
  member.roles.array().forEach(function(item, index, array) {
    if (isAGame(item.name)) {
      numberGames++;
    }

    // remove previous numberOfGames
    if (item.name.indexOf('jeux') > -1) {
      console.log('remove');
      member.removeRole(item.id);
    }
  });

  console.log("finale numbergame:" + numberGames);
  // member.addRole(member.guild.roles.find('name', numberGames+' jeux'));
}

function updateGameRoleOfficial(member) {
  var numberOfOfficialGames = 0;
  console.log("************Update official************");
  member.roles.array().forEach(function(item, index, array) {
    if (isOfficialGame(item.name)) {
      numberOfOfficialGames++;
    }
  });

  if (numberOfOfficialGames >= 2) {
    return true;
  } else {
    return false;
  }
}

function isOfficialGame(roleGameName) {
  var ok = false;
  console.log("************Parcour gamelist pour isOfficial************");
  config.gamelist.forEach(function(entry) {
    console.log(entry[0] + "->gamelist" + roleGameName);
    if (roleGameName.indexOf(entry[0]) !== -1) {
      console.log('Thats a match');
      if (entry[3] === 1) {
        ok = true;
        console.log('Thats official');
      }
    }
  });
  return ok;
}

function isAGame(str) {
  var ok = false;
  console.log("************Parcour gamelist pour isOfficial************");
  config.gamelist.forEach(function(entry) {
    console.log(entry[0] + "->gamelist" + str);
    if (str.indexOf(entry[0]) !== -1) {
      console.log('Thats a match');
    }
  });
  return ok;
}

function detectGameRoles(str) {
  console.log(str);
  var s = "";
  var gameDetected = [];
  toUTF8Array(str).forEach(function(item, index, array) {
    s = s + item
  });
  console.log("************Parcour name pour emoji************");
  config.gamelist.forEach(function(entry) {
    if (s.indexOf(entry[2]) !== -1) {
      console.log(entry[0] + "->DETECTEEEEEEEEED++++++++++++++++++++");
      gameDetected.push(entry);
    }
  });
  return gameDetected;
}

function readInUTF(str) {
  console.log(str);
  toUTF8Array(str).forEach(function(item, index, array) {
    console.log(item);
  });
}

function removeEmojis(string) {
  var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|[\ud83c[\ude50\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

  return string.replace(regex, '');
}

function toUTF8Array(str) {
  var utf8 = [];
  for (var i = 0; i < str.length; i++) {
    var charcode = str.charCodeAt(i);
    if (charcode < 0x80) utf8.push(charcode);
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6),
        0x80 | (charcode & 0x3f));
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(0xe0 | (charcode >> 12),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f));
    }
    // surrogate pair
    else {
      i++;
      // UTF-16 encodes 0x10000-0x10FFFF by
      // subtracting 0x10000 and splitting the
      // 20 bits of 0x0-0xFFFFF into two halves
      charcode = 0x10000 + (((charcode & 0x3ff) << 10) |
        (str.charCodeAt(i) & 0x3ff))
      utf8.push(0xf0 | (charcode >> 18),
        0x80 | ((charcode >> 12) & 0x3f),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f));
    }
  }
  return utf8;
}


client.login(config.token);