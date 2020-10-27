function createSessionRequestEmbed(sessionParty, message, args, icon) {
    console.log('hey')
    let displayDate = getSessionRequestDateAndTime(message, args);

    let sessionRequestEmbed = new MessageEmbed()
        .setColor(0x333333)
        .setTitle(`**Session_Request: **`)
        .addFields(
            { name: `**Session Commander:**`, value: `${message.author}\n`, inline: false },
            { name: `**Players(${sessionParty.length}/5):**`, value: `${createPlayerMention(sessionParty)}`, inline: false },
            { name: `**DM:**`, value: `*TBD*`, inline: false },
            { name: `**Time:**`, value: `*${days[displayDate.getDay()]} (${getDoubleDigitNumber(displayDate.getDate())}/${getDoubleDigitNumber(displayDate.getMonth() + 1)}) ${getDoubleDigitNumber(displayDate.getHours())}:${getDoubleDigitNumber(displayDate.getMinutes())}*`, inline: false },
            { name: `**Location:**`, value: `*Roll20 (online)*`, inline: false },
        );
    objective = message.content.slice(sliceValueForObjective).trim();
    if (objective.length > 500) return message.channel.send('I wont allow the objective to be longer than 500 characters!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
    sessionRequestEmbed
        .addField(`**Objective:**`, `*${objective}*`, false)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.username}`, message.author.avatarURL());

    if (icon) sessionRequestEmbed.setThumbnail(icon);
    return sessionRequestEmbed;
}
module.exports.help = {
    name: "stupidssssss",
    description: "Whenever someone asks a stupid question, DM's use this command",
    category: "Dungeons & Dragons"
}