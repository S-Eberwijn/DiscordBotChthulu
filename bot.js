const discord = require('discord.js');
const botConfig = require('./botConfig.json');
const fs = require("fs");

// Initialize Discord Bot
const bot = new discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION']});
bot.commands = new discord.Collection();

const serverStats = {
    guildID: '532525442201026580',
    totalUserID: '710048319820267570',
    onlineUserID: '710048608409354331',
    botCountID: '710048438032662551'
}

// Server variable
var guild;

// Channel variables
var generalChannel;
var verifyChannel;

// Role variables
var newcomerRole;
var verifiedRole;

fs.readdir("./commands/", (err, files) => {
    if (err) console.log(err);
    var jsFiles = files.filter(f => f.split(".").pop() === "js");
    if (jsFiles.length <= 0) {
        console.log("Found no .js files!");
        return;
    }

    jsFiles.forEach((f, i) => {
        var fileGet = require(`./commands/${f}`);
        console.log(`--{File ${f} is loaded}--`);
        var commandName = fileGet.help.name;
        bot.commands.set(commandName.toLowerCase(), fileGet);
    })
});

bot.on("ready", async () => {
    //Extra check to see if bot is ready
    console.log(`\n${bot.user.username} is online!\n`)
    bot.user.setActivity(`Khthonios`, { type: "LISTENING" });

    //Initialize guild (server)
    guild = bot.guilds.cache.get('532525442201026580');

    //Initialize text channels
    generalChannel = bot.channels.cache.get('634844140500418570');
    verifyChannel = bot.channels.cache.get('710220394849632361');

    //Initialize roles
    newcomerRole = guild.roles.cache.find(role => role.name === 'Newcomer');
    verifiedRole = guild.roles.cache.find(role => role.name === 'Verified');
});

bot.on("guildMemberAdd", member => {
    if (member.guild.id !== serverStats.guildID) return;

    //Change channel names
    bot.channels.cache.get(serverStats.totalUserID).setName(`Total Users :\t ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
    bot.channels.cache.get(serverStats.botCountID).setName(`Bot Count :\t ${member.guild.members.cache.filter(m => m.user.bot).size}`);

    //When a new person joins the server
    generalChannel.send(`Welcome to the server ${member.user.username}!`);
    member.roles.add(newcomerRole);
});

bot.on("guildMemberRemove", member => {
    //Change channel names
    bot.channels.cache.get(serverStats.totalUserID).setName(`Total Users : ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
    bot.channels.cache.get(serverStats.botCountID).setName(`Bot Count : ${member.guild.members.cache.filter(m => m.user.bot).size}`);
});

bot.on("presenceUpdate", function (oldMember, newMember) {
    //Once an user comes online or goes offline, this triggers
    bot.channels.cache.get(serverStats.onlineUserID).setName(`Online Users : ${newMember.guild.members.cache.filter(m => !m.user.bot && (m.user.presence.status === "online" || m.user.presence.status === "idle" || m.user.presence.status === "dnd")).size}`);
});

bot.on('messageReactionAdd', async (messageReaction, user) => {
    // When we receive a reaction we check if the reaction is partial or not
    if(messageReaction.partial){
        // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
        try{
            await messageReaction.fetch();
        } catch(error){
            console.log('Something went wrong when fetching the message: ', error);
            return;
        }
    }
    if (user.bot) return;
    const { message, emoji } = messageReaction;
    if (emoji.name === '✅' && message.channel.id === verifyChannel.id && message.id === '710220491088199771') {
        messageReaction.message.guild.members.cache.get(user.id).roles.add(verifiedRole)
    }
});

bot.on('messageReactionRemove', (reaction, user) => {
    console.log('a reaction has been removed');
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

bot.login(botConfig.token);
