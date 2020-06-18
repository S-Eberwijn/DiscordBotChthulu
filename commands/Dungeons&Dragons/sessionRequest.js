const { MessageEmbed } = require('discord.js');
const { writeToJsonDb } = require('../../otherFunctions/writeToJsonDb.js');
const { decimalToHex, getDoubleDigitNumber } = require("../../otherFunctions/numberFunctions");
const { getSessionRequestPartyMembers, getSessionRequestObjective } = require("../../otherFunctions/sessionRequestFunctions")
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
    let dmRole = message.guild.roles.cache.find(role => role.name === 'Dungeon Master');

    // get the partymembers
    let partyMembers = getSessionRequestPartyMembers(args, bot);

    // get the right date and time
    let suppliedDateText = args[0];
    args.shift();

    let hourAndMinute = args[0];
    let hour = parseInt(hourAndMinute.substring(0, 2));
    let minute = parseInt(hourAndMinute.substring(3, 5));
    args.shift();

    let displayDate = new Date(`${new Date().getFullYear()}-${suppliedDateText.substring(suppliedDateText.length - 2, suppliedDateText.length)}-${suppliedDateText.substring(0, 2)}`)
    displayDate.setHours(hour);
    displayDate.setMinutes(minute);

    // get the objective
    let objective = getSessionRequestObjective(args);


    let partyMembersText = 'Something went wrong!';

    // Check if the one who sent the message has the 'Dungeon Master' role
    if (message.guild.member(message.author).roles.cache.has(dmRole.id)) {

        partyMembersText = `${partyMembers[0]}`
        for (let i = 1; i < partyMembers.length; i++) {
            partyMembersText += `, ${partyMembers[i]}`;
        }

        // output message
        let outputEmbed = new MessageEmbed()
            .setColor(`#${decimalToHex(bot.sessions.nextSessionId)}`)
            .setThumbnail(message.guild.iconURL())
            .setTitle(`**Session_Request: **`)
            .addFields(
                { name: `**Session Commander:**`, value: `${partyMembers[0]}\n`, inline: false },
                { name: `**Players(${partyMembers.length}/5):**`, value: `${partyMembersText}`, inline: false },
                { name: `**DM:**`, value: `*TBD*`, inline: false },
                { name: `**Time:**`, value: `*${days[displayDate.getDay()]} (${getDoubleDigitNumber(displayDate.getDate())}/${getDoubleDigitNumber(displayDate.getMonth() + 1)}) ${getDoubleDigitNumber(displayDate.getHours())}:${getDoubleDigitNumber(displayDate.getMinutes())}*`, inline: false },
                { name: `**Location:**`, value: `*Roll20 (online)*`, inline: false },
                { name: `**Objective:**`, value: `*${objective.trim()}*`, inline: false }
            )
            .setTimestamp()
            .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL());

        message.delete();
        message.channel.send(outputEmbed);

        // Save to database (json for now)
        bot.sessions['requestedSessions'][bot.sessions['requestedSessions'].length] = {
            sessionId: bot.sessions.nextSessionId,
            sessionCommander: partyMembers[0],
            party: partyMembers,
            dungeonMaster: undefined,
            time: displayDate,
            location: "Roll20 (online)",
            objective: objective.trim()
        };
        bot.sessions.nextSessionId += 1;

        writeToJsonDb("sessions", bot.sessions);

    } else {
        message.channel.send("My masters have told me not to listen to you!");
    }

}

module.exports.help = {
    name: "session",
    description: "session status",
    category: "TEST"
}


