const Player = require('../database/models/Player.js');


module.exports = async (bot, messageReaction, user) => {
    const { message, emoji } = messageReaction;
    const roleSelectionChannel = bot.channels.cache.find(c => c.name == "role-selection" && c.type == "text");



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
                    await Player.findOne({where: {player_id: user.id}}).then(player => {
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
}