const {updateServerStatChannels} = require('../otherFunctions/updateServerStatChannel.js');

module.exports = async (bot, member) => {
    let newcomerRole = member.guild.roles.cache.find(role => role.name === 'Newcomer');

    // Update Server Stats channels
    //updateServerStatChannels(bot, member);
    
    //When a new person joins the server
    if(newcomerRole){
        member.roles.add(newcomerRole);
    }
}