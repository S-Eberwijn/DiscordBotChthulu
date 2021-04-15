const { MessageEmbed } = require('discord.js');

module.exports.run = async (bot, message, args) => {
    message.delete().then(() => message.channel.send('https://images-cdn.9gag.com/photo/ajEm4A8_700b.jpg'));
}

module.exports.help = {
    name: "?",
    alias: [],
    description: "NANI",
    category: "Miscellaneous"
}
