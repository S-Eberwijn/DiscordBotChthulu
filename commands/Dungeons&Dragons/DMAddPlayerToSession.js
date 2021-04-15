const SessionRequest = require('../../database/models/SessionRequest');
const PlannedSession = require('../../database/models/PlannedSession');
const DungeonMaster = require('../../database/models/DungeonMaster');

module.exports.run = async (bot, message, args) => {

    message.delete().then(async () => {
        const dungeonMasterIds = await getAllDungeonMasterIds(message.guild.id);
        const sessionChannelIdArray = await collectAllSessionChannelIds(message.guild.id);
        const user = message.mentions.users.first();
        if (!message.member.roles.cache.has(message.guild.roles.cache.find(role => role.name.includes('Dungeon Master')).id)) return message.channel.send('You\'re not a Dungeon Master!').then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));
        if (!user) return message.channel.send('You did not provide a player, use \"!add <@user_id>\"').then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));
        if (!sessionChannelIdArray.includes(message.channel.id)) return message.channel.send('This is not a session\'s channel! Type this in a session\'s channel of a session you want to add a player in!').then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));
        const session = await findRightSession(message.channel.id, message.guild.id);
        if (dungeonMasterIds.includes(user.id)) return message.channel.send('Dungeon Masters can not leave sessions!').then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));

        let sessionParty = session.get('session_party');
        if (sessionParty.includes(user.id)) return message.channel.send('This player is already in this session!').then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));
        //if (sessionParty >= 5) return message.channel.send('Session party is full!').then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));
        sessionParty.push(user.id)
        
        const sessionChannel = await message.guild.channels.cache.find(r => r.id === session.get('session_channel_id'));

        try {
            await message.guild.channels.cache.find(c => c.name == "session-request" && c.type == "text").messages.fetch(session.get('message_id')).then(async msg => {
                let editedEmbed = msg.embeds[0];
                editedEmbed.fields[1].name = editedEmbed.fields[1].name.replace(`${sessionParty.length - 1}`, `${sessionParty.length}`);
                editedEmbed.fields[1].value = `${createPlayerMention(sessionParty)}`;
                msg.edit(editedEmbed);

                sessionChannel.updateOverwrite(user, {
                    VIEW_CHANNEL: true,
                });

                session.session_party = sessionParty;
                session.save();

                return
            })
        } catch (error) {}
        try {
            await message.guild.channels.cache.find(c => c.name == "planned-sessions" && c.type == "text").messages.fetch(session.get('message_id')).then(async msg => {
                let editedEmbed = msg.embeds[0];
                editedEmbed.fields[1].name = editedEmbed.fields[1].name.replace(`${sessionParty.length - 1}`, `${sessionParty.length}`);
                editedEmbed.fields[1].value = `${createPlayerMention(sessionParty)}`;
                msg.edit(editedEmbed);

                sessionChannel.updateOverwrite(user, {
                    VIEW_CHANNEL: true,
                });

                session.session_party = sessionParty;
                session.save();

                return
            })
        } catch (error) {}
    })

}

module.exports.help = {
    name: "add",
    alias: [],
    description: "The Dungeon Master can use this to add a player to a session!",
    category: "Dungeons & Dragons"
}
async function getAllDungeonMasterIds(serverId) {
    let dungeonMasterIds = []
    await DungeonMaster.findAll({where: {server_id: serverId}}).then(dungeonMasters => {
        dungeonMasters.forEach(dungeonMaster => {
            dungeonMasterIds.push(dungeonMaster.get('dungeon_master_id'));
        });
    });
    return dungeonMasterIds;
}
async function collectAllSessionChannelIds(serverId) {
    let sessionChannelIdArray = [];
    await SessionRequest.findAll({where: {server_id: serverId}}).then(sessionRequest => {
        sessionRequest.forEach(request => {
            sessionChannelIdArray.push(request.get('session_channel_id'));
        });
    });
    await PlannedSession.findAll({where: {server_id: serverId}}).then(plannedSession => {
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