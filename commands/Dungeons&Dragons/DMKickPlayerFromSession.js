const SessionRequest = require('../../database/models/SessionRequest');
const PlannedSession = require('../../database/models/PlannedSession');
const DungeonMaster = require('../../database/models/DungeonMaster');

module.exports.run = async (bot, message, args) => {
    let session = await findRightSession(message.channel.id);

    message.delete().then(async () => {
        let dungeonMasterIds = await getAllDungeonMasterIds(message.guild.id);
        const sessionChannelIdArray = await collectAllSessionChannelIds(message.guild.id);
        if (!sessionChannelIdArray.includes(message.channel.id)) return message.channel.send('This is not a session\'s channel! Type this in a session\'s channel of a session you want to leave!').then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));
        if (message.member.roles.cache.has(message.guild.roles.cache.find(role => role.name.includes('Dungeon Master')).id) && message.mentions.users.first()) {
            if (dungeonMasterIds.includes(message.mentions.users.first().id)) return message.channel.send('Dungeon Masters can not leave sessions!').then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));

            let sessionParty = session.get('session_party');
            if (sessionParty.includes(message.mentions.users.first().id)) {
                sessionParty.splice(sessionParty.indexOf(message.mentions.users.first().id), 1);
                try {
                    await message.guild.channels.cache.find(c => c.name == "session-request" && c.type == "text").messages.fetch(session.get('message_id')).then(async msg => {
                        const sessionChannel = await message.guild.channels.cache.find(r => r.id === session.get('session_channel_id'));
                        if (session.get('session_commander_id') === message.mentions.users.first().id) {
                            msg.delete();
                            sessionChannel.delete();
                            session.destroy();
                        } else {
                            let editedEmbed = msg.embeds[0];
                            editedEmbed.fields[1].value = `${createPlayerMention(sessionParty)}`;
                            editedEmbed.fields[1].name = editedEmbed.fields[1].name.replace(`${sessionParty.length + 1}`, `${sessionParty.length}`);
                            msg.edit(editedEmbed);

                            sessionChannel.updateOverwrite(message.mentions.users.first(), {
                                VIEW_CHANNEL: false,
                            });

                            session.session_party = sessionParty;
                            session.save();
                        }
                        return
                    })
                } catch (error) { }
                try {
                    await message.guild.channels.cache.find(c => c.name == "planned-sessions" && c.type == "text").messages.fetch(session.get('message_id')).then(async msg => {
                        const sessionChannel = await message.guild.channels.cache.find(r => r.id === session.get('session_channel_id'));
                        if (session.get('session_commander_id') === message.mentions.users.first().id) {
                            msg.delete();
                            sessionChannel.delete();
                            session.destroy();
                        } else {
                            let editedEmbed = msg.embeds[0];
                            editedEmbed.fields[1].value = `${createPlayerMention(sessionParty)}`;
                            editedEmbed.fields[1].name = editedEmbed.fields[1].name.replace(`${sessionParty.length + 1}`, `${sessionParty.length}`);
                            msg.edit(editedEmbed);

                            sessionChannel.updateOverwrite(message.mentions.users.first(), {
                                VIEW_CHANNEL: false,
                            });

                            session.session_party = sessionParty;
                            session.save();
                        }
                        return
                    })
                } catch (error) { }
            } else return message.channel.send(`You are not in this session, thus you can not leave it!`).then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));

        } else if (message.member.roles.cache.has(message.guild.roles.cache.find(role => role.name === 'Dungeon Master').id)) return message.channel.send('Different error').then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));
    })
}

module.exports.help = {
    name: "kick",
    alias: [],
    description: "The Dungeon Master can use this to kick a player from a session!",
    category: "Dungeons & Dragons"
}
async function getAllDungeonMasterIds(serverId) {
    let dungeonMasterIds = []
    await DungeonMaster.findAll({ where: { server_id: serverId } }).then(dungeonMasters => {
        dungeonMasters.forEach(dungeonMaster => {
            dungeonMasterIds.push(dungeonMaster.get('dungeon_master_id'));
        });
    });
    return dungeonMasterIds;
}
async function collectAllSessionChannelIds(serverId) {
    let sessionChannelIdArray = [];
    await SessionRequest.findAll({ where: { server_id: serverId } }).then(sessionRequest => {
        sessionRequest.forEach(request => {
            sessionChannelIdArray.push(request.get('session_channel_id'));
        });
    });
    await PlannedSession.findAll({ where: { server_id: serverId } }).then(plannedSession => {
        plannedSession.forEach(request => {
            sessionChannelIdArray.push(request.get('session_channel_id'));
        });
    });
    return sessionChannelIdArray;
}
async function findRightSession(channelId) {
    let session = [];
    await SessionRequest.findOne({ where: { session_channel_id: channelId } }).then(async sessionRequest => {
        if (sessionRequest) {
            session = sessionRequest;
        }
    });
    await PlannedSession.findOne({ where: { session_channel_id: channelId } }).then(async plannedSession => {
        if (plannedSession) {
            session = plannedSession;
        }
    });
    return session;
}
function createPlayerMention(sessionParty) {
    let playerMentionString = `<@!${sessionParty[0]}>`;
    if (sessionParty.length > 1) {
        sessionParty.forEach(player => {
            if (!playerMentionString.includes(player)) {
                playerMentionString += `, <@!${player}>`;
            }
        });
    }
    return playerMentionString;
}