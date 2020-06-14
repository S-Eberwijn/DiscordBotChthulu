const discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
    return message.channel.send("Ping: " + (message.createdTimestamp - Date.now()) + "ms");
}

module.exports.help = {
    name: "ping",
    description: "Gives the time it takes for the bot to respond",
    category: "Information"
}