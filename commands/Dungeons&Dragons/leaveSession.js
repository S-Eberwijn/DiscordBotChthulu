const SessionRequest = require('../../database/models/SessionRequest');
const PlannedSession = require('../../database/models/PlannedSession');

module.exports.run = async (bot, message, args) => {
    let user = message.author;
    let session = await findRightSession(message.channel.id, message.guild.id);

    message.delete().then(async () => {
        const sessionChannelIdArray = await collectAllSessionChannelIds(message.guild.id);
        if (!sessionChannelIdArray.includes(message.channel.id)) return message.channel.send('This is not a session\'s channel! Type this in a session\'s channel of a session you want to leave!').then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));
        if (!message.member.roles.cache.has(message.guild.roles.cache.find(role => role.name === 'Player'))) return message.channel.send('You do not have a \'Player\' role, get lost kid!').then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));
        let sessionParty = session.get('session_party');
        if (sessionParty.includes(user.id)) return message.channel.send(`You are not in this session, thus you can not leave it!`).then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));
        sessionParty.splice(sessionParty.indexOf(user.id), 1);
        try {
            await bot.channels.cache.find(c => c.name == "session-request" && c.type == "text").messages.fetch(session.get('message_id')).then(async msg => {
                const sessionChannel = await message.guild.channels.cache.find(r => r.id === session.get('session_channel_id'));
                if (session.get('session_commander_id') === user.id) {
                    msg.delete();
                    sessionChannel.delete();
                    session.destroy();
                } else {
                    let editedEmbed = msg.embeds[0];
                    editedEmbed.fields[1].value = `${createPlayerMention(sessionParty)}`;
                    editedEmbed.fields[1].name = editedEmbed.fields[1].name.replace(`${sessionParty.length + 1}`, `${sessionParty.length}`);
                    msg.edit(editedEmbed);

                    sessionChannel.updateOverwrite(user, { VIEW_CHANNEL: false, });

                    session.session_party = sessionParty;
                    session.save();
                }
                return
            })
        } catch (error) { }
        try {
            await bot.channels.cache.find(c => c.name == "planned-sessions" && c.type == "text").messages.fetch(session.get('message_id')).then(async msg => {
                const sessionChannel = await message.guild.channels.cache.find(r => r.id === session.get('session_channel_id'));
                if (session.get('session_commander_id') === user.id) {
                    msg.delete();
                    sessionChannel.delete();
                    session.destroy();
                } else {
                    let editedEmbed = msg.embeds[0];
                    editedEmbed.fields[1].value = `${createPlayerMention(sessionParty)}`;
                    editedEmbed.fields[1].name = editedEmbed.fields[1].name.replace(`${sessionParty.length + 1}`, `${sessionParty.length}`);
                    msg.edit(editedEmbed);

                    sessionChannel.updateOverwrite(user, {
                        VIEW_CHANNEL: false,
                    });

                    session.session_party = sessionParty;
                    session.save();
                }
                return
            })
        } catch (error) { }

    })
}

module.exports.help = {
    name: "leave",
    description: "Use this in a session-channel to leave that session",
    category: "Dungeons & Dragons"
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
async function findRightSession(channelId, serverId) {
    let session = [];
    await SessionRequest.findOne({ where: { session_channel_id: channelId, server_id: serverId } }).then(async sessionRequest => {
        if (sessionRequest) {
            session = sessionRequest;
        }
    });
    await PlannedSession.findOne({ where: { session_channel_id: channelId, server_id: serverId } }).then(async plannedSession => {
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