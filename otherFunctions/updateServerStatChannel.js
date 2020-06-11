 async function updateServerStatChannels() {
    
     //TODO: make it so it can run on multiple servers
     //Change channel names
     if (bot.initialization.initialized[0].serverStatsChannels.botCountChannelId != '' && bot.initialization.initialized[0].serverStatsChannels.totalUsersChannelId != '') {
        
         await bot.channels.cache.get(bot.initialization.initialized[0].serverStatsChannels.botCountChannelId).setName(`Bot Count : ${guild.members.cache.filter(m => m.user.bot).size}`);
         //bot.channels.cache.get(bot.initialization.initialized[0].serverStatsChannels.onlineUsersChannelId).setName(`Online Users : ${guild.members.cache.filter(m => !m.user.bot && (m.user.presence.status === "online" || m.user.presence.status === "idle" || m.user.presence.status === "dnd")).size}`);
         await bot.channels.cache.get(bot.initialization.initialized[0].serverStatsChannels.totalUsersChannelId).setName(`Total Users : ${guild.members.cache.filter(m => !m.user.bot).size}`);
     }
 }
