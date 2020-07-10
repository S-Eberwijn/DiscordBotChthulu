const { writeToJsonDb } = require('../../otherFunctions/writeToJsonDb.js');
const { getSessionRequestPartyMembers, getSessionRequestPartyMembersIds, getSessionRequestObjective, getSessionRequestDateAndTime, createSessionRequestEmbed } = require("../../otherFunctions/sessionRequestFunctions")
const db = require('../../database/database.js');
const SessionRequest = require('../../database/models/SessionRequest');
const CharacterRequestSession = require('../../database/models/CharacterRequestSession');
// use: !session <sessionCommander> ... <n < 5> <dd/mm> <hh:mm> <objective>

module.exports.run = async (bot, message, args) => {

    // get the partymembers
    let partyMembers = getSessionRequestPartyMembers(args, bot);

    // get the right date and time
    let displayDate = getSessionRequestDateAndTime(args)

    // get the objective
    let objective = getSessionRequestObjective(args);

    let partyMembersIds = getSessionRequestPartyMembersIds(partyMembers);
    // Check if the one who sent the message has the 'Dungeon Master' role
    if (message.guild.roles.cache.find(role => role.name === 'Dungeons & Dragons')) {
        if (message.guild.member(message.author).roles.cache.has(message.guild.roles.cache.find(role => role.name === 'Dungeons & Dragons').id)) {

            let outputEmbed = createSessionRequestEmbed(partyMembers, displayDate, objective, message, bot);
            message.delete();
            message.channel.send(outputEmbed).then(async message => {
                await message.react('✔️');
                await message.react('✖️');

                SessionRequest.create({
                    request_message_id: message.id,
                    session_commander_id: partyMembers[0].id,
                    session_party: partyMembersIds,
                    date: displayDate.toString(),
                    objective: objective
                });

                // partyMembers.forEach(partyMember => {
                //     CharacterRequestSession.create({
                //         character_id: partyMember.id,
                //         request_message_id: message.id
                //     });
                // });

            });


            // let testRequest = await SessionRequest.findOne({
            //     where: { id: 2 }
            // });
            // let partyMembersTest = testRequest.get('session_party');
            // console.log(partyMembersTest);



            // Save to database (json for now)
            // bot.sessions['requestedSessions'][bot.sessions['requestedSessions'].length] = {
            //     sessionId: bot.sessions.nextSessionId,
            //     sessionCommander: partyMembers[0],
            //     party: partyMembers,
            //     dungeonMaster: undefined,
            //     time: displayDate,
            //     location: "Roll20 (online)",
            //     objective: objective.trim()
            // };
            //bot.sessions.nextSessionId += 1;

            writeToJsonDb("sessions", bot.sessions);
        } else {
            message.channel.send("My masters have told me not to listen to you!");
        }
    } else {
        message.channel.send("Did not fine a \"Dungeon Master\" role")
    }
}

module.exports.help = {
    name: "session",
    description: "session status",
    category: "TEST"
}


