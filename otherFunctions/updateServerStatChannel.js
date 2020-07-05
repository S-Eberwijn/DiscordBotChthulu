exports.updateServerStatChannels = function(bot, member) {

    // Declare which guild its for
    let guildNumber;
    for (let i = 0; i < bot.initialization.initialized.length; i++){
        if(bot.initialization.initialized[i].guildId == member.guild.id){
            guildNumber = i;
        }
    } 

    // Declare Server Stat Channels
    if (guildNumber) {
        let botCountChannel = bot.channels.cache.get(bot.initialization.initialized[guildNumber].serverStatsChannels.botCountChannelId);
        let onlineUsersChannel = bot.channels.cache.get(bot.initialization.initialized[guildNumber].serverStatsChannels.onlineUsersChannelId);
        let totalUsersChannel = bot.channels.cache.get(bot.initialization.initialized[guildNumber].serverStatsChannels.totalUsersChannelId);
        //TODO: make it so it can run on multiple servers
    
        // Change channel names
        if (botCountChannel && onlineUsersChannel && totalUsersChannel) {
            
            botCountChannel.setName(`Bot Count : ${member.guild.members.cache.filter(m => m.user.bot).size}`);
            onlineUsersChannel.setName(`Online Users : ${member.guild.members.cache.filter(m => !m.user.bot && (m.user.presence.status === "online" || m.user.presence.status === "idle" || m.user.presence.status === "dnd")).size}`);
            totalUsersChannel.setName(`Total Users : ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
        
        }
    }
  
}
