const { MessageEmbed } = require('discord.js');
const SessionRequest = require('../../database/models/SessionRequest');
const PlayerCharacter = require('../../database/models/PlayerCharacter');
const fs = require("fs");
// use: !session <n < 5> <dd/mm> <hh:mm> <objective>
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthAndNumberOfDaysMap = new Map([[1, 31], [2, 28], [3, 31], [4, 30], [5, 31], [6, 30], [7, 31], [8, 31], [9, 30], [10, 31], [11, 30], [12, 31]]);
const functionArguments = ['new']
let sliceValueForObjective = 0;
let objective = '';


module.exports.run = async (bot, message, args) => {
    message.delete();

    const sessionRequestCatagory = await message.guild.channels.cache.find(c => c.name == "--SESSION REQUESTS--" && c.type == "category");
    const sessionRequestChannel = await message.guild.channels.cache.find(c => c.name == "session-request" && c.type == "text");

    if (!args[0]) return message.reply('You did not provide any arguments!').then(msg => msg.delete({ timeout: 3000 }));
    sliceValueForObjective = 1 + this.help.name.length + 1;

    if (args[0].toLowerCase() == functionArguments[0].toLowerCase()) {
        if (!sessionRequestChannel) return message.channel.send('There is no \"session-request\" channel found on this server!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
        if (message.channel.id !== sessionRequestChannel.id) return message.channel.send('Please send the request in the \"session-request\" channel!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
        if (!message.guild.roles.cache.find(role => role.name.includes('Adventurer'))) return message.channel.send('Did not find a \"Adventurer\" role on this server. Please add one!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
        if (!message.guild.member(message.author).roles.cache.has(message.guild.roles.cache.find(role => role.name.includes('Adventurer')).id)) return message.channel.send('It seems like you do not have the \"Adventurer\" role! Get lost kid.').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));



        try {
            sliceValueForObjective += functionArguments[0].length + 1;
            await PlayerCharacter.findOne({ where: { player_id: message.author.id, alive: 1, server_id: message.guild.id } }).then(playerCharacter => {
                message.channel.send(createSessionRequestEmbed(getSessionRequestPartyMembers(message), message, args, playerCharacter.get('picture_url'))).then(async sessionRequestEmbed => {

                    const addUserEmoji = message.guild.emojis.cache.find(emoji => emoji.name === 'adduser');
                    if (!addUserEmoji) return message.channel.send('This server does not have an emoji called \"adduser\"... thus I cannot make the session embed').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
                    let sessionRequest = await createSessionRequestDatabaseEntry(sessionRequestEmbed, getSessionRequestPartyMembers(message), getSessionRequestDateAndTime(message, args), objective, message.guild.id);
                    await sessionRequestEmbed.react('✔️');
                    await sessionRequestEmbed.react('✖️');
                    await sessionRequestEmbed.react(addUserEmoji);

                    //TODO FIND OUT WHY OBJECTIVE HAS FAULT VALUE



                    message.guild.channels.create(`${message.author.username}s-request`, "text").then(async createdChannel => {
                        createdChannel.setParent(sessionRequestCatagory.id, { lockPermission: false });
                        createdChannel.updateOverwrite(message.channel.guild.roles.everyone, {
                            VIEW_CHANNEL: false,
                        });
                        createdChannel.updateOverwrite(message.guild.roles.cache.find(role => role.name.includes('Dungeon Master')), {
                            VIEW_CHANNEL: true,
                        });
                        sessionRequest.get('session_party').forEach(playerId => {
                            createdChannel.updateOverwrite(bot.users.cache.get(playerId), {
                                VIEW_CHANNEL: true,
                            });
                        });
                        sessionRequest.session_channel_id = createdChannel.id;
                        sessionRequest.save();

                        bot.sessionAddUserRequest['sessions'][bot.sessionAddUserRequest['sessions'].length] = {
                            session_channel_id: createdChannel.id,
                            requested: [],
                            denied: []
                        };
                        fs.writeFile("./jsonDb/sessionAddUserRequest.json", JSON.stringify(bot.sessionAddUserRequest, null, 4), err => {
                            if (err) throw err;
                        });
                    });
                }).catch(err => { console.log(err); return sessionRequestEmbed.delete() });
            }).catch(err => console.log(err));
        } catch (error) { };
    }
}

module.exports.help = {
    name: "session",
    alias: [],
    description: "session status",
    category: "Dungeons & Dragons"
}

function createSessionRequestEmbed(sessionParty, message, args, icon) {
    let displayDate = getSessionRequestDateAndTime(message, args);

    let sessionRequestEmbed = new MessageEmbed()
        .setThumbnail(icon)
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

    return sessionRequestEmbed;
}

function createPlayerMention(sessionParty) {
    let playerMentionString = `<@!${sessionParty[0]}>`;
    if (sessionParty.length > 1) {
        sessionParty.forEach(player => {
            if (!playerMentionString.includes(player)) {
                playerMentionString += `, <@!${player}>`;
            }
            sliceValueForObjective += 5 + player.length;
        });
    }
    return playerMentionString;
}

function getSessionRequestPartyMembers(message) {

    let sessionParty = [`${message.author.id}`];
    if (message.mentions.members.first(6).length > 5) return message.channel.send('You cannot have more than 5 players in one session!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));

    message.mentions.members.first(5).forEach(player => {
        if (!sessionParty.includes(player.user.id)) {
            sessionParty.push(player.user.id);
        }
    });


    return sessionParty;
}

function getSessionRequestDateAndTime(message, args) {
    const dateRegex = /^([0-3][0-9])(\/)(((1)[0-2])|((0)[0-9]))/i;
    const timeRegex = /^([0-2][0-9])(\:)([0-6][0-9])/i;
    let dateFound, timeFound;
    for (let index = 0; index < args.length; index++) {
        if (args[index].match(dateRegex)) {
            dateFound = args[index].match(dateRegex)[0]
            break;
        }
    }
    for (let index = 0; index < args.length; index++) {
        if (args[index].match(timeRegex)) {
            timeFound = args[index].match(timeFound).input;
            break;
        }
    }
    if (dateFound && timeFound) {
        let day = parseInt(dateFound.substring(0, 2));
        let month = parseInt(dateFound.substring(dateFound.length - 2, dateFound.length));
        let hour = parseInt(timeFound.substring(0, 2));
        let minutes = parseInt(timeFound.substring(timeFound.length - 2, timeFound.length));
        if (month <= 12 && month > 0) {
            if (day <= monthAndNumberOfDaysMap.get(month)) {

                let displayDate = new Date(`${new Date().getFullYear()}-${month}-${day}`);
                if (hour < 24 && hour > 0) {
                    displayDate.setHours(hour);
                    if (minutes >= 0 && minutes < 60) {
                        displayDate.setMinutes(minutes);
                        if (!(displayDate < Date.now())) {
                            sliceValueForObjective += dateFound.length + timeFound.length + 2;


                            return displayDate;
                        } else return message.channel.send('The session cannot take place in the past!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
                    } else return message.channel.send('You\'ve entered a wrong minute format!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
                } else return message.channel.send('You\'ve entered a wrong hour format!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
            } else return message.channel.send(`In this case choose a day between 01-${monthAndNumberOfDaysMap.get(month)}`).then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
        } else return message.channel.send('Choose a month between 01-12!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
    } else return message.channel.send('Wrong date and/or time input! It should be <DD/MM> <HH:MM>').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));


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

function createSessionRequestDatabaseEntry(sessionRequestEmbed, partyMembers, displayDate, objective, serverId) {
    let sessionRequest = SessionRequest.create({
        message_id: sessionRequestEmbed.id,
        session_commander_id: partyMembers[0],
        session_party: partyMembers,
        date: displayDate.toString(),
        objective: objective,
        server_id: serverId
    });
    return sessionRequest;
}
