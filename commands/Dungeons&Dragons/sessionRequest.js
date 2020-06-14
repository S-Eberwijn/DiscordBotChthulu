const discord = require('discord.js');


module.exports.run = async (bot, message, args) => {
    let inDatabase = false;
    let indexOfFoundUser;
    let dmRole = message.guild.roles.cache.find(role => role.name === 'Dungeon Master');

    let msg = message;
    let sessionCommander = message.mentions.users.first();
    let partyMembers = [];

    for (let i = 0; i < message.mentions.users.size; i++) {
        partyMembers.push(getUserFromMention(args[i], bot));
    }

    // for (let i = 0; i < bot.stupidQuestionTracker['users'].length; i++) {
    //     if (message.mentions.users.first().id === bot.stupidQuestionTracker['users'][i].userId) {
    //         inDatabase = true;
    //         indexOfFoundUser = i;
    //     }
    // }

    // Check if the one who sent the message has the 'Dungeon Master' role
    if (message.guild.member(message.author).roles.cache.has(dmRole.id)) {
        let count = 0;
        console.log(partyMembers)
        //Only go in if it has a mention in the arg
        // while (message.mentions.users.first()){
        //     count++;
        //     console.log(count);
        // }

        // output message
        let output = ``;
        // session number
        output += `**Session_${bot.sessions.totalSessions}: **\n\n`;
        // session commander
        output += `**Session Commander:** ${partyMembers[0]}\n`
        // display pleyers
        output += `**Players(${partyMembers.length}/5):** ${partyMembers[0]}`;
        for (let i = 1; i < partyMembers.length; i++) {
            output += `, ${partyMembers[i]}`;
        }
        // dungeon master
        output += `\n**DM:** *TBD*\n`;
        // date + time
        output += `**Time:** *Test*\n`;
        // location
        output += `**Location:** *Roll20 (online)*\n`;
        // objective
        output += `**Objective:** *Test*\n`;
        // ending
        output += `=============================================================`;

        message.channel.send(output);
    } else {
        message.channel.send("My masters have not told me to listen to you!");
    }


}

module.exports.help = {
    name: "session",
    description: "session status",
    category: "TEST"
}


function getUserFromMention(mention, bot) {
    if (!mention) return;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }

        return bot.users.cache.get(mention);
    }
}
