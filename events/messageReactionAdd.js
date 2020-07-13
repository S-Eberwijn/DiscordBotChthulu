const { MessageEmbed } = require('discord.js');
const SessionRequest = require('../database/models/SessionRequest');
const PlannedSession = require('../database/models/PlannedSession');
const PlayerCharacter = require('../database/models/PlayerCharacter.js');
const Player = require('../database/models/Player.js');
const GeneralInfo = require('../database/models/GeneralInfo.js');


module.exports = async (bot, messageReaction, user) => {

    let verifyChannel = bot.channels.cache.find(c => c.name == "verify" && c.type == "text");
    let generalChannel = bot.channels.cache.find(c => c.name == "general" && c.type == "text");
    let roleSelectionChannel = bot.channels.cache.find(c => c.name == "role-selection" && c.type == "text");
    let sessionRequestChannel = bot.channels.cache.find(c => c.name == "session-request" && c.type == "text");
    let plannedSessionsChannel = bot.channels.cache.find(c => c.name == "planned-sessions" && c.type == "text");
    let pastSessionsChannel = bot.channels.cache.find(c => c.name == "past-sessions" && c.type == "text");

    let verifiedRole = messageReaction.message.guild.roles.cache.find(role => role.name === 'Verified');
    let newcomerRole = messageReaction.message.guild.roles.cache.find(role => role.name === 'Newcomer');
    let dmRole = messageReaction.message.guild.roles.cache.find(role => role.name === 'Dungeon Master');
    //let dungeonsAndDragonsRole = messageReaction.message.guild.roles.cache.find(role => role.name === 'Dungeons & Dragons');


    // When we receive a reaction we check if the reaction is partial or not
    if (messageReaction.partial) {
        // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
        try {
            await messageReaction.fetch();
        } catch (error) {
            console.log('Something went wrong when fetching the message: ', error);
            return;
        }
    }

    if (user.bot) return;
    const { message, emoji } = messageReaction;

    if (verifyChannel) {
        if (message.channel.id === verifyChannel.id) {

            if (emoji.name === '✅') {
                messageReaction.message.guild.members.cache.get(user.id).roles.add(verifiedRole);
                messageReaction.message.guild.members.cache.get(user.id).roles.remove(newcomerRole);

                message.reactions.cache.get('✅').remove().catch(error => console.error('Failed to remove reactions: ', error));
                message.react('✅');

                generalChannel.send(`Welcome to the server ${messageReaction.message.guild.members.cache.get(user.id)}!`);
            } else {
                message.reactions.cache.get(emoji.name).remove().catch(error => console.error('Failed to remove reactions: ', error));
            }
        }
    }
    if (sessionRequestChannel) {
        if (message.channel.id === sessionRequestChannel.id) {
            if (message.guild.member(user).roles.cache.has(dmRole.id)) {

                const editedEmbed = new MessageEmbed(message.embeds[0]);

                let foundSessionRequest = await SessionRequest.findOne({ where: { request_message_id: message.id } });
                let generalInfo = await GeneralInfo.findOne();

                // update embed with the right DM
                editedEmbed.fields[2].value = `<@${user.id}>`;
                editedEmbed.setTitle(`**Session_${generalInfo.get('session_number')}: **`);

                // send the message to a new channel
                plannedSessionsChannel.send(editedEmbed).then(async message => {
                    await message.react('🟢');
                    await message.react('🔴');

                    let partyMembers = foundSessionRequest.get('session_party');
                    for (let i = 0; i < partyMembers.length; i++) {
                        PlayerCharacter.update(
                            { next_session_id: message.id },
                            { where: { player_id: partyMembers[i], alive: 1 } });
                    }
                    if (generalInfo) {
                        PlannedSession.create({
                            session_id: message.id,
                            session_commander_id: foundSessionRequest.get('session_commander_id'),
                            session_party: foundSessionRequest.get('session_party'),
                            date: foundSessionRequest.get('date'),
                            objective: foundSessionRequest.get('objective'),
                            session_number: generalInfo.get('session_number'),
                            dungeon_master_id: user.id,
                            session_status: 'NOT PLAYED'
                        }).then(() => {
                            generalInfo.session_number += 1;
                            generalInfo.save();
                        });
                    } else {
                        message.channel.send('Something went wrong; Cannot fine generalInfo table;');
                    }
                });
                foundSessionRequest.destroy();
                message.delete();
            } else {
                message.reactions.cache.get(emoji.name).remove().catch(error => console.error('Failed to remove reactions: ', error));
            }

        }
    }
    if (plannedSessionsChannel) {
        if (message.channel.id === plannedSessionsChannel.id) {
            if (message.guild.member(user).roles.cache.has(dmRole.id)) {

            }
        }
    }

    if (roleSelectionChannel) {
        if (message.channel.id === roleSelectionChannel.id) {
            switch (emoji.name) {
                case 'LoL':
                    messageReaction.message.guild.members.cache.get(user.id).roles.add(messageReaction.message.guild.roles.cache.find(role => role.name === 'League of Legends'));
                    break;
                case '🐉':
                    messageReaction.message.guild.members.cache.get(user.id).roles.add(messageReaction.message.guild.roles.cache.find(role => role.name === 'Dungeons & Dragons'));
                    await Player.create({
                        player_id: user.id,
                        player_name: user.username
                    });
                    break;
                case 'minecraft':
                    messageReaction.message.guild.members.cache.get(user.id).roles.add(messageReaction.message.guild.roles.cache.find(role => role.name === 'Minecraft'));
                    break;
                default:
                    break;
            }
        }
    }
}