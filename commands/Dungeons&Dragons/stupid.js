const fs = require("fs");


module.exports.run = async (bot, message, args) => {
    let inDatabase = false;
    let indexOfFoundUser;
    let dmRole = message.guild.roles.cache.find(role => role.name === 'Dungeon Master');

    for (let i = 0; i < bot.stupidQuestionTracker['users'].length; i++) {
        if (message.mentions.users.first().id === bot.stupidQuestionTracker['users'][i].userId) {
            inDatabase = true;
            indexOfFoundUser = i;
        }
    }

    // Check if the one who sent the message has the 'Dungeon Master' role
    if (message.guild.member(message.author).roles.cache.has(dmRole.id)) {
        //Only go in if it has a mention in the arg
        if (message.mentions.users.first()) {
            if (inDatabase) {
                let stupidQuestionTrackerCount = bot.stupidQuestionTracker['users'][indexOfFoundUser].count + 1;
                bot.stupidQuestionTracker['users'][indexOfFoundUser] = {
                    username: message.mentions.users.first().username,
                    userId: message.mentions.users.first().id,
                    count: stupidQuestionTrackerCount
                };
                fs.writeFile("./jsonDb/stupidQuestionTracker.json", JSON.stringify(bot.stupidQuestionTracker, null, 4), err => {
                    if (err) throw err;
                });
                if (stupidQuestionTrackerCount % 3 === 0) {
                    // Add a mute role!
                    console.log("Do something!");
                }
            } else {
                bot.stupidQuestionTracker['users'][bot.stupidQuestionTracker['totalUsers'].xUsers] = {
                    username: message.mentions.users.first().username,
                    userId: message.mentions.users.first().id,
                    count: 1
                };
                bot.stupidQuestionTracker['totalUsers'].xUsers = bot.stupidQuestionTracker['totalUsers'].xUsers + 1;
                fs.writeFile("./jsonDb/stupidQuestionTracker.json", JSON.stringify(bot.stupidQuestionTracker, null, 4), err => {
                    if (err) throw err;
                });

                message.channel.send("Succesful added to the database!");
            }
        } else {
            message.channel.send("Use: !stupid <mention user>");
        }
    } else {
        message.channel.send("My masters have not told me to listen to you!");
    }

}

module.exports.help = {
    name: "stupid",
    description: "Whenever someone asks a stupid question, DM's use this command",
    category: "Dungeons & Dragons"
}