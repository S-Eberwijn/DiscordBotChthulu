const { getSessionRequestPartyMembers, getSessionRequestPartyMembersIds, getSessionRequestObjective, getSessionRequestDateAndTime, createSessionRequestEmbed } = require("./sessionRequestFunctions")
const SessionRequest = require('../database/models/SessionRequest');
// use: !session <sessionCommander> ... <n < 5> <dd/mm> <hh:mm> <objective>

module.exports.run = async (bot, message, args) => {
    let sessionRequestChannel = bot.channels.cache.find(c => c.name == "session-request" && c.type == "text");

    if (sessionRequestChannel) {
        if (sessionRequestChannel.id === message.channel.id) {
            // get the partymembers
            let partyMembers = getSessionRequestPartyMembers(args, bot);
            if(partyMembers.length > 5){
                message.delete();
                sessionRequestChannel.send('The session cannot have more than 5 players!').then(msg => msg.delete({ timeout: 3000 }));
                return;
            }

            // get the right date and time
            let displayDate = getSessionRequestDateAndTime(args);
            if (displayDate < Date.now()){
                message.delete();
                sessionRequestChannel.send('The session cannot take place in the past!').then(msg => msg.delete({ timeout: 3000 }));
                return;
            }

            // get the objective
            let objective = getSessionRequestObjective(args);

            let partyMembersIds = getSessionRequestPartyMembersIds(partyMembers);
            // Check if the one who sent the message has the 'Dungeon Master' role
            if (message.guild.roles.cache.find(role => role.name === 'Dungeons & Dragons')) {
                if (message.guild.member(message.author).roles.cache.has(message.guild.roles.cache.find(role => role.name === 'Dungeons & Dragons').id)) {

                    let outputEmbed = createSessionRequestEmbed(partyMembers, displayDate, objective, message, bot);
                    message.delete();

                    message.channel.send(outputEmbed).then(async message => {
                        SessionRequest.create({
                            request_message_id: message.id,
                            session_commander_id: partyMembers[0].id,
                            session_party: partyMembersIds,
                            date: displayDate.toString(),
                            objective: objective
                        });
                        await message.react('✔️');
                        await message.react('✖️');
                        await message.react('732604232582037604');
                        await message.react('732605879165386782');
                        await message.react('732605922119254067');
                        await message.react('732607204279975976');
                        await message.react('732611171068280833');

                        
                    });

                } else {
                    message.channel.send("My masters have told me not to listen to you!");
                }
            } else {
                message.channel.send("Did not fine a \"Dungeon Master\" role")
            }
        } else {
            message.delete();
            message.channel.send('Please send the request in the \"session-request\" channel!').then(msg => msg.delete({ timeout: 3000 }));
        }
    } else {
        message.delete();
        message.channel.send('There is no \"session-request\" channel found on this server!');
    }

}

module.exports.help = {
    name: "oldsession",
    description: "session status",
    category: "TEST"
}


