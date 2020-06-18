const {updateServerStatChannels} = require('../otherFunctions/updateServerStatChannel.js');

module.exports = (bot, oldMember, newMember) => {
    // Update Server Stats channels
    updateServerStatChannels(bot, newMember);
  
    //console.log(`${newMember.user.tag} went ${newMember.user.presence.status}.`);
}