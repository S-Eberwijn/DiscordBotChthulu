const discord = require('discord.js');
const botConfig = require('./botConfig.json');
const fs = require("fs");


// Initialize Discord Bot
const bot = new discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
bot.commands = new discord.Collection();



// Server variables
var guild;

// Channel variables
var generalChannel;
// Role variables
var newcomerRole;
var verifiedRole;

//Read and log command files
fs.readdir("./commands/", (err, files) => {
    if (err) console.log(err);
    var jsFiles = files.filter(f => f.split(".").pop() === "js");
    if (jsFiles.length <= 0) {
        console.log("Found no .js files!");
        return;
    }

    jsFiles.forEach((f, i) => {
        var fileGet = require(`./commands/${f}`);
        console.log(`--{ File ${f} is loaded }--`);
        var commandName = fileGet.help.name;
        bot.commands.set(commandName.toLowerCase(), fileGet);
    });

});

bot.on("ready", async () => {
    //Extra check to see if bot is ready
    console.log(`\n${bot.user.username} is online!\n`)
    bot.user.setActivity(`Khthonios`, { type: "LISTENING" });

    //Initialize guild (server)
    guild = bot.guilds.cache.get('532525442201026580');

    //Initialize text channels
    generalChannel = bot.channels.cache.get('634844140500418570');

    //Initialize roles
    newcomerRole = guild.roles.cache.find(role => role.name === 'Newcomer');
    verifiedRole = guild.roles.cache.find(role => role.name === 'Verified');

    //Initialize databases
    bot.stupidQuestionTracker = require("./jsonDb/stupidQuestionTracker.json");
    bot.ressurection = require("./jsonDb/ressurection.json");
    bot.initialization = require("./jsonDb/initialization.json");

    //Update resurrection database
    let ressurectionCount = bot.ressurection['resurrections'].count + 1;
    bot.ressurection['resurrections'] = {
        count: ressurectionCount
    };
    fs.writeFile("./jsonDb/ressurection.json", JSON.stringify(bot.ressurection, null, 4), err => {
        if (err) throw err;
    });


});

bot.on("guildMemberAdd", member => {
    if (member.guild.id !== guild.id) return;
    //updateServerStatChannels();

    //When a new person joins the server
    member.roles.add(newcomerRole);
});

bot.on("guildMemberRemove", member => {
    //updateServerStatChannels();
});

bot.on("presenceUpdate", function (oldMember, newMember) {
    //updateServerStatChannels();
});

bot.on('messageReactionAdd', async (messageReaction, user) => {
    let verifyChannel = bot.channels.cache.find(c => c.name == "verify" && c.type == "text");
    // When we receive a reaction we check if the reaction is partial or not
    if (messageReaction.partial) {
        // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
        try {
            await messageReaction.fetch();
        } catch (error) {
            console.log('Something went wrong when fetching the message: ', error);
            return;
        }
    }

    if (user.bot) return;
    const { message, emoji } = messageReaction;

    if (verifyChannel) {
        if (message.channel.id === verifyChannel.id) {

            if (emoji.name === '✅') {
                messageReaction.message.guild.members.cache.get(user.id).roles.add(verifiedRole);
                messageReaction.message.guild.members.cache.get(user.id).roles.remove(newcomerRole);

                message.reactions.cache.get('✅').remove().catch(error => console.error('Failed to remove reactions: ', error));
                message.react('✅');

                generalChannel.send(`Welcome to the server ${messageReaction.message.guild.members.cache.get(user.id)}!`);
            } else {
                message.reactions.cache.get(emoji.name).remove().catch(error => console.error('Failed to remove reactions: ', error));
            }
        }
    }

});

bot.on('messageReactionRemove', (messageReaction, user) => {
    if (user.bot) return;
    const { message, emoji } = messageReaction;
    console.log(`${user.username} removed a reaction: ${emoji.name}`);
    
});

bot.on("message", async message => {

    //Do nothing when bot sends message
    if (message.author.bot) return;
    //Do nothing when message is a direct message 
    if (message.channel.type === "dm") return;

    var prefix = botConfig.prefix;
    var messageArray = message.content.split(" ");
    var command = messageArray[0].toLowerCase();
    var arguments = messageArray.slice(1);
    var commands = bot.commands.get(command.slice(prefix.length));

    if (messageArray[0].charAt(0) === prefix.charAt(0)) {
        if (commands) commands.run(bot, message, arguments);
    }
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

bot.login(botConfig.token);
