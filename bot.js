const discord = require('discord.js');
const fs = require("fs");
const Enmap = require('enmap');
const { token } = require('./config')

// Initialize Discord Bot
const bot = new discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
bot.commands = new Enmap();


//Read and log command files
fs.readdir("./commands/", async (err, files) => {
    if (err) console.log(err);
    var jsFiles = files.filter(f => f.split(".").pop() === "js");
    if (jsFiles.length <= 0) {
        console.log("Found no .js files!");
        return;
    }

    jsFiles.forEach((f, i) => {
        var fileGet = require(`./commands/${f}`);
        console.log(`--{ Command ${f} is loaded }--`);
        var commandName = fileGet.help.name;
        bot.commands.set(commandName.toLowerCase(), fileGet);
    });
    console.log('\n');
});

fs.readdir('./events/', (err, files) => {
    if(err) console.log(err);
    files.forEach(file => {
        if(!file.endsWith('.js')) return;
        const evt = require(`./events/${file}`);
        let evtName = file.split('.')[0];
        console.log(`--{ Event ${evtName} is loaded }--`);
        bot.on(evtName, evt.bind(null, bot));
    });
    console.log('\n');
});


// async function updateServerStatChannels() {
    
//     //TODO: make it so it can run on multiple servers

//     //Change channel names
//     if (bot.initialization.initialized[0].serverStatsChannels.botCountChannelId != '' && bot.initialization.initialized[0].serverStatsChannels.totalUsersChannelId != '') {
        
//         await bot.channels.cache.get(bot.initialization.initialized[0].serverStatsChannels.botCountChannelId).setName(`Bot Count : ${guild.members.cache.filter(m => m.user.bot).size}`);
//         //bot.channels.cache.get(bot.initialization.initialized[0].serverStatsChannels.onlineUsersChannelId).setName(`Online Users : ${guild.members.cache.filter(m => !m.user.bot && (m.user.presence.status === "online" || m.user.presence.status === "idle" || m.user.presence.status === "dnd")).size}`);
//         await bot.channels.cache.get(bot.initialization.initialized[0].serverStatsChannels.totalUsersChannelId).setName(`Total Users : ${guild.members.cache.filter(m => !m.user.bot).size}`);
//     }
// }

bot.login(token);
