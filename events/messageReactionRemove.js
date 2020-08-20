const Player = require('../database/models/Player.js');
const SessionRequest = require('../database/models/SessionRequest.js');


module.exports = async (bot, messageReaction, user) => {
    const { message, emoji } = messageReaction;
    const roleSelectionChannel = bot.channels.cache.find(c => c.name == "role-selection" && c.type == "text");
    const sessionRequestChannel = bot.channels.cache.find(c => c.name == "session-request" && c.type == "text");
    const dmRole = messageReaction.message.guild.roles.cache.find(role => role.name === 'Dungeon Master');
    const dungeonsAndDragonsRole = messageReaction.message.guild.roles.cache.find(role => role.name === 'Dungeons & Dragons');

    if (user.bot) return;
    console.log(`${user.username} removed a reaction: ${emoji.name}`);

    if (roleSelectionChannel) {
        if (message.channel.id === roleSelectionChannel.id) {
            switch (emoji.name) {
                case 'LoL':
                    messageReaction.message.guild.members.cache.get(user.id).roles.remove(messageReaction.message.guild.roles.cache.find(role => role.name === 'League of Legends'));
                    break;
                case '🐉':
                    messageReaction.message.guild.members.cache.get(user.id).roles.remove(messageReaction.message.guild.roles.cache.find(role => role.name === 'Dungeons & Dragons'));
                    await Player.findOne({ where: { player_id: user.id } }).then(player => {
                        player.destroy();
                    });
                    break;
                case 'minecraft':
                    messageReaction.message.guild.members.cache.get(user.id).roles.remove(messageReaction.message.guild.roles.cache.find(role => role.name === 'Minecraft'));
                    break;
                default:
                    break;
            }
        }
    }
    if (sessionRequestChannel) {
        if (message.channel.id === sessionRequestChannel.id) {
            if (message.guild.member(user).roles.cache.has(dungeonsAndDragonsRole.id)) {
                if (emoji.name.includes('adduser')) {
                    let newEmbed = message.embeds[0];
                    if (newEmbed.fields[1].value.includes(user.id)) {
                        if (newEmbed.fields[1].value.charAt(user.id.length + 3) === ',' && newEmbed.fields[1].value.charAt(user.id.length + 4) === ' ') {
                            newEmbed.fields[1].value = newEmbed.fields[1].value.replace(`<@${user.id}>, `, '');
                            newEmbed.fields[1].value = newEmbed.fields[1].value.replace(`, <@${user.id}>`, '');
                        }
                        var count = await (newEmbed.fields[1].value.match(/,/g) || []).length + 1;
                        newEmbed.fields[1].name = newEmbed.fields[1].name.replace(`${count + 1}`, `${count}`);

                        SessionRequest.findOne({ where: { request_message_id: message.id } }).then(sessionRequest => {
                            let partyMembers = sessionRequest.get('session_party');
                            partyMembers.splice(partyMembers.indexOf(user.id), 1)
                            sessionRequest.session_party = partyMembers;
                            sessionRequest.save();
                
                        })
                        message.edit(newEmbed);
                    }


                } else {
                    message.reactions.cache.get(emoji.id).remove().catch(error => console.error('Failed to remove reactions: ', error));
                }

            } else {
                message.reactions.cache.get(emoji.name).remove().catch(error => console.error('Failed to remove reactions: ', error));
            }
        }
    }
}