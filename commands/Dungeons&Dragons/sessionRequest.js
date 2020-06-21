const { writeToJsonDb } = require('../../otherFunctions/writeToJsonDb.js');
const { getSessionRequestPartyMembers, getSessionRequestObjective, getSessionRequestDateAndTime, createSessionRequestEmbed } = require("../../otherFunctions/sessionRequestFunctions")
// use: !session <sessionCommander> ... <n < 5> <dd/mm> <hh:mm> <objective>

module.exports.run = async (bot, message, args) => {
    let dmRole = message.guild.roles.cache.find(role => role.name === 'Dungeon Master');

    // get the partymembers
    let partyMembers = getSessionRequestPartyMembers(args, bot);

    // get the right date and time
    let displayDate = getSessionRequestDateAndTime(args)

    // get the objective
    let objective = getSessionRequestObjective(args);

    // Check if the one who sent the message has the 'Dungeon Master' role
    if (message.guild.member(message.author).roles.cache.has(dmRole.id)) {
        let outputEmbed = createSessionRequestEmbed(partyMembers, displayDate, objective, message, bot);

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


