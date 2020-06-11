module.exports = async (bot, member) => {
    let newcomerRole = member.guild.roles.cache.find(role => role.name === 'Newcomer');

    // Update Server Stats channels
    let update = require('../otherFunctions/updateServerStatChannel.js');
    update.updateServerStatChannels(bot, newMember);
    
    //When a new person joins the server
    member.roles.add(newcomerRole);
}