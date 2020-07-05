const {updateServerStatChannels} = require('../otherFunctions/updateServerStatChannel.js');

module.exports = async (bot, member) => {
    // Update Server Stats channels
    //updateServerStatChannels(bot, member);

    console.log(`${member.user.tag} left **${member.guild.name}**`);
}