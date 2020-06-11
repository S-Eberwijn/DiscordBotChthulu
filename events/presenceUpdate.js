//const { updateServerStatChannels } = require('../otherFunctions/updateServerStatChannel');

module.exports = (bot, oldMember, newMember) => {
    // Update Server Stats channels
    let update = require('../otherFunctions/updateServerStatChannel.js');
    update.updateServerStatChannels(bot, newMember);
  
    console.log(`${newMember.user.tag} went ${newMember.user.presence.status}.`);

}