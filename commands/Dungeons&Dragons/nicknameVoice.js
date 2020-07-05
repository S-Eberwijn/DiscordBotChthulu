const fs = require('fs');
const nameTrackerJson = './jsonDb/nameTracker.json';
const {writeToJsonDb} = require('../../otherFunctions/writeToJsonDb.js');



module.exports.run = async (bot, msg, args) => {
    console.log(msg.author.username)
    let nickJSON = fs.readFileSync(nameTrackerJson);
    nickJSON = JSON.parse(nickJSON);
    if (!nickJSON.players) {
        nickJSON.players = [];
        writeToJsonDb("nameTracker",nickJSON);
    }
    switch (args[0]) {
        
        case 'register':
            //argumentvalidation
            if (!args[1]) return msg.reply("**ERROR**: Not enough valid arguments\nCorrect format: !nick <register/delete> <\"Nick\"> <\"Channel Name>\"");
            if (!msg.content.match((/\".*?\"/g)[1])) return msg.reply("**ERROR**: Invalid arguments. Remember to put your nickname and the channel name in quotation marks (\"like this\")");
            if (!msg.content.match((/\".*?\"/g)[2])) return msg.reply("**ERROR**: Invalid arguments. Remember to put your nickname and the channel name in quotation marks (\"like this\")");

            //Argument Saving (thanks RikerTuros)
            try {
                var nickName = msg.content.match(/\".*?\"/g)[0].replace(/\"?\"/g, '');
            }
            catch (err) {
                console.error("Error parsing message for nickname");
                console.error(err);
                return msg.reply("**ERROR**: Invalid arguments. Remember to put your nickname in quotation marks (\"like this\")");
            }
            try {
                var channelName = msg.content.match(/\".*?\"/g)[1].replace(/\"?\"/g, '');
            }
            catch (err) {
                console.error("Error parsing message for channel");
                console.error(err);
                return msg.reply("**ERROR**: Invalid arguments. Remember to put the channel name in quotation marks (\"like this\")");
            }
            
            //validateChannel & search ID
            if (msg.guild.channels.cache.find(channel => channel.name === `${channelName}`)) {
                var channelID = msg.guild.channels.cache.find(channel => channel.name === `${channelName}`).id;
            } else {
                return msg.reply("**ERROR**: There is no such channel. Maybe you made a typo?");
            }

            //summary
            msg.channel.send(`__**Registration success!**__\nChannel Name: ${channelName}\nNick: ${nickName}`);

            //saving format
            var player;
            //check if player exists
            //true -> load player from file 
            //false -> create new player
            for (let i = 0; i < nickJSON.players.length; i++) {
                if (nickJSON.players[i].userid === msg.author.id) {
                    player = nickJSON.players[i];
                }
            }
            if (!player) {
                var player = {
                    name: msg.member.username,
                    userid: msg.author.id,
                    registrations: []
                }
                nickJSON.players.push(player);
            }
            //check for existing registration
            //true -> rename nick
            //false -> register
            nickJSON.players.forEach(player => {
                var found = false;
                //renaming
                player.registrations.forEach(register => {
                    if (register.channelid === channelID && player.userid === msg.author.id) {
                        register.nickname = nickName;
                        found = true;
                    }
                })
                //new registration
                if (player.userid === msg.author.id && !found) {
                    player.registrations.push({
                        nickname: nickName,
                        channelid: channelID
                    })
                }
            });
            writeToJsonDb("nameTracker",nickJSON);
            break;
        case 'delete':
            console.log(msg.content.match((/\".*?\"/g)))
            //Validation of the given arguments
            if (!args[1]) return msg.reply("**ERROR**: Not enough valid arguments\nCorrect format: !nick <register/rename/delete> <\"Nick\"> <\"Channel Name>\"");
            if (!msg.content.match((/\".*?\"/g)[0])) return msg.reply("**ERROR**: Invalid arguments. Remember to put your nickname and the channel name in quotation marks (\"like this\")");
            var delNickName = args[1].replace(/\"?\"/g, '');
            for (let i = 0; i < nickJSON.players.length; i++) {
                for (let j = 0; j < nickJSON.players[i].registrations.length; j++) {
                    if (nickJSON.players[i].registrations[j].nickname === delNickName) {
                        nickJSON.players[i].registrations.splice(j, 1);
                        msg.reply("Successfully removed the nick!");
                        break;
                    }
                }
            }
            writeToJsonDb("nameTracker", nickJSON);
            break;
    }
    
}

module.exports.help = {
    name: "nick",
    description: "A command to change your nicknames when in a specific voice channel:\n!nick <register/delete> <\"Nick\"> <\"Channel Name>\"",
    category: "TEST"
}


