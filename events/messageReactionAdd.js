const { MessageEmbed } = require('discord.js');
const SessionRequest = require('../database/models/SessionRequest');
const PlannedSession = require('../database/models/PlannedSession');
const PlayerCharacter = require('../database/models/PlayerCharacter.js');
const Player = require('../database/models/Player.js');
const GeneralInfo = require('../database/models/GeneralInfo.js');
const PastSession = require('../database/models/PastSession.js');
const fs = require("fs");

module.exports = async (bot, messageReaction, user) => {
    // When we receive a reaction we check if the reaction is partial or not
    if (messageReaction.partial) {
        // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
        try {
            await messageReaction.fetch();
        } catch (error) {
            return console.log('Something went wrong when fetching the message: ', error);
        }
    }

    if (user.bot) return;
    const { message, emoji } = messageReaction;

    if (message.guild != null) {
        let sessionRequestChannel = bot.channels.cache.find(c => c.name == "session-request" && c.type == "text");
        let plannedSessionsChannel = bot.channels.cache.find(c => c.name == "planned-sessions" && c.type == "text");
        let pastSessionsChannel = bot.channels.cache.find(c => c.name == "past-sessions" && c.type == "text");

        let dmRole = messageReaction.message.guild.roles.cache.find(role => role.name === 'Dungeon Master');
        let playerRole = messageReaction.message.guild.roles.cache.find(role => role.name === 'Player');

        if (sessionRequestChannel) {
            if (message.channel.id === sessionRequestChannel.id) {
                if (message.guild.member(user).roles.cache.has(dmRole.id)) {
                    if (emoji.name === '✔️') {
                        let foundSessionRequest = await SessionRequest.findOne({ where: { message_id: message.id } });
                        let generalInfo = await GeneralInfo.findOne({ where: { server_id: messageReaction.message.guild.id } });
                        if (generalInfo) {
                            if (foundSessionRequest) {
                                updatePartyNextSessionId(foundSessionRequest.get('session_party'), message.id, message.guild.id);
                                plannedSessionsChannel.send(createPlannedSessionEmbed(user.id, generalInfo.get('session_number'), message.embeds[0])).then(async message => {
                                    createPlannedSessionDatabaseEntry(message.id, foundSessionRequest, generalInfo, user.id, message.guild.id);
                                    await message.react('🟢');
                                    await message.react('🔴');
                                    let foundPlannedSession = await PlannedSession.findOne({ where: { message_id: message.id, server_id: message.guild.id } })
                                    bot.channels.cache.find(c => c.id == foundSessionRequest.get('session_channel_id') && c.type == "text").setName(`session-${foundPlannedSession.get('session_number')}`);
    
                                });
                               
                                foundSessionRequest.destroy();
                                message.delete();
                                return;
                            } else return message.channel.send('Something went wrong; Cannot find the right session request in the database!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
                        } else return message.channel.send('Something went wrong; Cannot find this server in the database!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
                    } else if (emoji.name === '✖️') {
                        await deleteSessionRequestChannel(message, message.id, message.guild.id)
                        await deleteSessionRequest(message.id, message.guild.id);
                        message.delete();
                        return;
                    } else return message.reactions.resolve(emoji.id).users.remove(user.id).catch(err => console.log(err));
                } else if (message.guild.member(user).roles.cache.has(playerRole.id)) {
                    if (emoji.name.includes('adduser')) {
                        message.reactions.resolve(emoji.id).users.remove(user.id).catch(err => console.log(err));
                        await SessionRequest.findOne({ where: { message_id: message.id } }).then(async sessionRequest => {
                            if (!checkIfPlayerIsAlreadyInParty(sessionRequest.get('session_party'), user.id)) {
                                if (sessionRequest.get('session_party').length < 5) {
                                    if (!checkIfPlayerAlreadyRequestedOrDenied(bot, user.id, emoji.id, message, sessionRequest.get('session_channel_id'))) {
                                        for (let i = 0; i < bot.sessionAddUserRequest['sessions'].length; i++) {
                                            if (bot.sessionAddUserRequest['sessions'][i].session_channel_id === sessionRequest.get('session_channel_id')) {
                                                bot.sessionAddUserRequest['sessions'][i].requested[bot.sessionAddUserRequest['sessions'][i].requested.length] = { "user_id": `${user.id}` };
                                                break;
                                            }
                                        }
                                        fs.writeFile("./jsonDb/sessionAddUserRequest.json", JSON.stringify(bot.sessionAddUserRequest, null, 4), err => {
                                            if (err) throw err;
                                        });
                                    } else return;
                                    try {
                                        const createdChannel = bot.channels.cache.find(c => c.id == sessionRequest.get('session_channel_id') && c.type == "text");
                                        createdChannel.send(`Hello, ${bot.users.cache.get(sessionRequest.get('session_commander_id'))}. ${user.username} is requesting to join your session!`).then(async msg => {
                                            await msg.react('✔️');
                                            await msg.react('✖️');

                                            const emojiFilter = (reaction, user) => {
                                                if (user.bot === true) return false;
                                                return (reaction.emoji.name === '✔️' || reaction.emoji.name === '✖️') && user.id === sessionRequest.get('session_commander_id');
                                            };
                                            msg.awaitReactions(emojiFilter, {
                                                max: 1,
                                                time: 86400000,
                                                errors: ['time'],
                                            }).then(collected => {
                                                msg.delete().catch();
                                                if (collected.first().emoji.name === '✔️') {
                                                    user.send(`Your request to join ${bot.users.cache.get(sessionRequest.get('session_commander_id')).username}'s session has been **ACCEPTED**`);
                                                    createdChannel.updateOverwrite(user, {
                                                        VIEW_CHANNEL: true,
                                                    });
                                                    for (let i = 0; i < bot.sessionAddUserRequest['sessions'].length; i++) {
                                                        if (bot.sessionAddUserRequest['sessions'][i].session_channel_id === sessionRequest.get('session_channel_id')) {
                                                            for (let j = 0; j < bot.sessionAddUserRequest['sessions'][i].requested.length; j++) {
                                                                if (bot.sessionAddUserRequest['sessions'][i].requested[j].user_id === user.id) {
                                                                    bot.sessionAddUserRequest['sessions'][i].requested[j].user_id = "";
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                    }
                                                    fs.writeFile("./jsonDb/sessionAddUserRequest.json", JSON.stringify(bot.sessionAddUserRequest, null, 4), err => {
                                                        if (err) throw err;
                                                    });
                                                    message.edit(updateSessionRequestEmbedPartyMembers(message, sessionRequest.get('session_party'), user.id).embeds[0]);
                                                    updateDatabaseSessionRequestParty(sessionRequest, user.id);
                                                } else if (collected.first().emoji.name === '✖️') {
                                                    user.send(`Your request to join ${bot.users.cache.get(sessionRequest.get('session_commander_id')).username}'s session has been **DECLINED**`);
                                                    for (let i = 0; i < bot.sessionAddUserRequest['sessions'].length; i++) {
                                                        if (bot.sessionAddUserRequest['sessions'][i].session_channel_id === sessionRequest.get('session_channel_id')) {
                                                            for (let j = 0; j < bot.sessionAddUserRequest['sessions'][i].requested.length; j++) {
                                                                if (bot.sessionAddUserRequest['sessions'][i].requested[j].user_id === user.id) {
                                                                    bot.sessionAddUserRequest['sessions'][i].requested[j].user_id = "";
                                                                    bot.sessionAddUserRequest['sessions'][i].denied[bot.sessionAddUserRequest['sessions'][i].denied.length] = { "user_id": `${user.id}` };
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                    }
                                                    fs.writeFile("./jsonDb/sessionAddUserRequest.json", JSON.stringify(bot.sessionAddUserRequest, null, 4), err => {
                                                        if (err) throw err;
                                                    });
                                                }
                                            }).catch(() => {
                                                msg.delete().catch();
                                                user.send(`Your request to join ${bot.users.cache.get(sessionRequest.get('session_commander_id')).username}'s session has **NOT BEEN ANSWERED**`);
                                            });
                                        });
                                    } catch (error) {
                                        console.log(error)
                                    }
                                    return;
                                } else return message.channel.send('A session can only have 5 players!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
                            } else return message.channel.send('You are already in this session request!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
                        }).catch(error => console.error(error));
                    }
                } else return message.reactions.cache.get(emoji.name).remove().catch(error => console.error('Failed to remove reactions: ', error));
            }
        }
        if (plannedSessionsChannel) {
            if (message.channel.id === plannedSessionsChannel.id) {
                if (message.guild.member(user).roles.cache.has(dmRole.id)) {
                    let editedEmbed = new MessageEmbed(message.embeds[0]);
                    let foundPlannedSession = await PlannedSession.findOne({ where: { message_id: message.id, server_id: message.guild.id } });
                    if (foundPlannedSession) {
                        let sessionStatus;
                        if (emoji.name === '🟢') {
                            sessionStatus = 'PLAYED';
                            editedEmbed.setTitle(`${editedEmbed.title} [${sessionStatus}]`);
                            createPastSessionDatabaseEntry(message.id, foundPlannedSession, sessionStatus, message.guild.id).then(() => {
                                foundPlannedSession.destroy();
                                pastSessionsChannel.send(editedEmbed);
                                message.delete();
                                bot.channels.cache.find(c => c.id == foundPlannedSession.get('session_channel_id') && c.type == "text").delete();
                            });
                        } else if (emoji.name === '🔴') {
                            sessionStatus = 'CANCELED';
                            editedEmbed.setTitle(`${editedEmbed.title} [${sessionStatus}]`);
                            createPastSessionDatabaseEntry(message.id, foundPlannedSession, sessionStatus, message.guild.id).then(() => {
                                foundPlannedSession.destroy();
                                pastSessionsChannel.send(editedEmbed);
                                message.delete();
                                bot.channels.cache.find(c => c.id == foundPlannedSession.get('session_channel_id') && c.type == "text").delete();
                            });
                        } else return message.reactions.resolve(emoji.id).users.remove(user.id).catch(err => console.log(err));
                    } else return message.channel.send('Could not find the planned session in the database!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
                }
            }
        }
    } else console.log('Dit was een dm')
}

String.prototype.replaceAt = function (index, replacement) {
    if (index >= this.length) {
        return this.valueOf();
    }
    return this.substring(0, index) + replacement + this.substring(index + 1);
}
function createPlannedSessionDatabaseEntry(sessionId, foundSessionRequest, generalInfo, dungeonMasterId, serverId) {
    PlannedSession.create({
        message_id: sessionId,
        session_commander_id: foundSessionRequest.get('session_commander_id'),
        session_party: foundSessionRequest.get('session_party'),
        date: foundSessionRequest.get('date'),
        objective: foundSessionRequest.get('objective'),
        session_number: generalInfo.get('session_number'),
        dungeon_master_id: dungeonMasterId,
        session_channel_id: foundSessionRequest.get('session_channel_id'),
        session_status: 'NOT PLAYED YET',
        server_id: serverId
    }).then(() => {
        generalInfo.session_number += 1;
        generalInfo.save();
    });
}
function updatePartyNextSessionId(party, next_session_id, serverId) {
    party.forEach(player => {
        PlayerCharacter.update(
            { next_session_id: next_session_id },
            { where: { player_id: player, alive: 1, server_id: serverId } });
    });
}
function createPlannedSessionEmbed(dungeonMasterId, sessionNumber, editedEmbed) {
    editedEmbed.fields[2].value = `<@${dungeonMasterId}>`;
    editedEmbed.setTitle(`**Session_${sessionNumber}: **`);
    return editedEmbed;
}
function deleteSessionRequest(sessionId, serverId) {
    SessionRequest.findOne({ where: { message_id: sessionId, server_id: serverId } }).then(sessionRequest => {
        sessionRequest.destroy();
    });
}
function deleteSessionRequestChannel(message, sessionId, serverId) {
    SessionRequest.findOne({ where: { message_id: sessionId, server_id: serverId } }).then(sessionRequest => {
        message.guild.channels.cache.find(r => r.id === sessionRequest.get('session_channel_id')).delete();
    });
}
function updateDatabaseSessionRequestParty(sessionRequest, playerId) {
    let partyMembers = sessionRequest.get('session_party');
    partyMembers.push(playerId);
    sessionRequest.session_party = partyMembers;
    sessionRequest.save();
}
function updateSessionRequestEmbedPartyMembers(message, party, playerId) {
    message.embeds[0].fields[1].value += `, <@${playerId}>`;
    message.embeds[0].fields[1].name = message.embeds[0].fields[1].name.replace(`${party.length}`, `${party.length + 1}`);
    return message;
}
function checkIfPlayerIsAlreadyInParty(party, playerId) {
    if (party.includes(playerId)) {
        return true;
    } else return false;
}
function checkIfPlayerAlreadyRequestedOrDenied(bot, userId, emojiId, message, sessionChannelId) {
    for (let i = 0; i < bot.sessionAddUserRequest['sessions'].length; i++) {
        if (bot.sessionAddUserRequest['sessions'][i].session_channel_id === sessionChannelId) {
            for (let j = 0; j < bot.sessionAddUserRequest['sessions'][i].requested.length; j++) {
                if (bot.sessionAddUserRequest['sessions'][i].requested[j].user_id === userId) {
                    message.channel.send(`${bot.users.cache.get(userId)}, you already requested to join this session, please be patient!`).then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));;
                    return true;
                }
            }
            for (let j = 0; j < bot.sessionAddUserRequest['sessions'][i].denied.length; j++) {
                if (bot.sessionAddUserRequest['sessions'][i].denied[j].user_id === userId) {
                    message.channel.send(`${bot.users.cache.get(userId)}, your request to join this session was declined by the session commander, better luck next time!`).then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));;
                    return true;
                }
            }
            break;
        }
    }
    return false;
}
async function createPastSessionDatabaseEntry(id, foundPlannedSession, sessionStatus, serverId) {
    return new Promise(async function (resolve, reject) {
        await PastSession.create({
            message_id: id,
            session_commander_id: foundPlannedSession.get('session_commander_id'),
            session_party: foundPlannedSession.get('session_party'),
            date: foundPlannedSession.get('date'),
            objective: foundPlannedSession.get('objective'),
            session_number: foundPlannedSession.get('session_number'),
            dungeon_master_id: foundPlannedSession.get('dungeon_master_id'),
            session_status: sessionStatus,
            server_id: serverId
        }).then(() => { resolve() }).catch(err => console.log(err));
    })
}