module.exports = async (bot, member) => {
    // Update Server Stats channels
    let update = require('../otherFunctions/updateServerStatChannel.js');
    update.updateServerStatChannels(bot, newMember);

    console.log(`${member.user.tag} left **${member.guild.name}**`);
}