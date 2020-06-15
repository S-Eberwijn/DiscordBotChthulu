const { MessageEmbed } = require('discord.js');

// use: !session <sessionCommander> ... <n < 5> <dd/mm> <hh:mm> <objective>

const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
]

module.exports.run = async (bot, message, args) => {

    // get the partymembers
    let partyMembers = [];
    // for (let i = 0; i < message.mentions.users.size; i++) {
        
    // }

    while (args[0].startsWith('<@') && args[0].endsWith('>')){
        partyMembers.push(getUserFromMention(args[0], bot));
        args.shift();
    }
    let suppliedDateText = args[0];
    args.shift();

    let hourAndMinute = args[0];
    let hour = parseInt(hourAndMinute.substring(0,2));
    let minute = parseInt(hourAndMinute.substring(3,5));
    args.shift();

    let objective = "";
    while (args[0]){
        objective += `${args[0]} `;
        args.shift();
    }

    let displayDate = new Date(`${new Date().getFullYear()}-${suppliedDateText.substring(suppliedDateText.length - 2, suppliedDateText.length)}-${suppliedDateText.substring(0, 2)}`)
    displayDate.setHours(hour);
    displayDate.setMinutes(minute);

    let partyMembersText = 'Something went wrong!';
    let dmRole = message.guild.roles.cache.find(role => role.name === 'Dungeon Master');

    // Check if the one who sent the message has the 'Dungeon Master' role
    if (message.guild.member(message.author).roles.cache.has(dmRole.id)) {
        partyMembersText = `${partyMembers[0]}`
        for (let i = 1; i < partyMembers.length; i++) {
            partyMembersText += `, ${partyMembers[i]}`;
        }

        // DMs need to be able to react to the embed and bot must edit DM field
        // Display objective in code block


        // output message
        let outputEmbed = new MessageEmbed()
            .setThumbnail(message.guild.iconURL())
            .setTitle(`**Session_${bot.sessions.totalSessions}: **\n\n`)
            .addFields(
                { name: `**Session Commander:**`, value: `${partyMembers[0]}\n`, inline: false },
                { name: `**Players(${partyMembers.length}/5):**`, value: `${partyMembersText}`, inline: false },
                { name: `**DM:**`, value: `*TBD*`, inline: false },
                { name: `**Time:**`, value: `*${days[displayDate.getDay()]} (${getDoubleDigitNumber(displayDate.getDate())}/${getDoubleDigitNumber(displayDate.getMonth()+1)}) ${getDoubleDigitNumber(displayDate.getHours())}:${getDoubleDigitNumber(displayDate.getMinutes())}*`, inline: false },
                { name: `**Location:**`, value: `*Roll20 (online)*`, inline: false },
                { name: `**Objective:**`, value: `*${objective.trim()}*`, inline: false }
            )
            .setTimestamp()
            .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL());

        message.delete();
        message.channel.send(outputEmbed);
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

function getDoubleDigitNumber(number) {
    let doubleDigitNumber = '';
    if (number < 10) {
        doubleDigitNumber = `0${number}`;
    } else {
        doubleDigitNumber = `${number}`;
    }
    return doubleDigitNumber;
}
