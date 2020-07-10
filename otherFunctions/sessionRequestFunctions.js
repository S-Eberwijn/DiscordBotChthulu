const { MessageEmbed } = require('discord.js');
const { decimalToHex, getDoubleDigitNumber } = require("../otherFunctions/numberFunctions");
const {getUserFromMention} = require("./getUserFromMention");

const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

exports.getSessionRequestPartyMembers = function (args, bot) {
    let partyMembers = [];
    while (args[0].startsWith('<@') && args[0].endsWith('>')) {
        partyMembers.push(getUserFromMention(args[0], bot));
        args.shift();
    }
    return partyMembers;
}

exports.getSessionRequestPartyMembersIds = function (partyMembers) {
    let partyMembersIds = [];
    partyMembers.forEach(partyMember => {
        partyMembersIds.push(partyMember.id);
    });
    return partyMembersIds;
}

exports.getSessionRequestObjective = function (args) {
    let objective = '';
    while (args[0]) {
        objective += `${args[0]} `;
        args.shift();
    }
    return objective;
}

exports.getSessionRequestDateAndTime = function (args) {
    let suppliedDateText = args[0];
    args.shift();

    let hourAndMinute = args[0];
    let hour = parseInt(hourAndMinute.substring(0, 2));
    let minute = parseInt(hourAndMinute.substring(3, 5));
    args.shift();

    let displayDate = new Date(`${new Date().getFullYear()}-${suppliedDateText.substring(suppliedDateText.length - 2, suppliedDateText.length)}-${suppliedDateText.substring(0, 2)}`)
    displayDate.setHours(hour);
    displayDate.setMinutes(minute);

    return displayDate;
 }

 exports.createSessionRequestEmbed = function (partyMembers, displayDate, objective, message, bot) { 
    let partyMembersText = createPartyMemberText(partyMembers);

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

    return outputEmbed;
}

function createPartyMemberText(partyMembers){
    let partyMembersText = 'Something went wrong!';

    partyMembersText = `${partyMembers[0]}`;
    for (let i = 1; i < partyMembers.length; i++) {
        partyMembersText += `, ${partyMembers[i]}`;
    }
    return partyMembersText;
}