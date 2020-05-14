const discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
    var botEmbed = new discord.MessageEmbed()
        .setDescription("discord bot info")
        .setColor("#29e53f")
        .setThumbnail(bot.user.defaultAvatarURL)
        .addField("Bot name", bot.user.username)
        .addField("Created at", bot.user.createdAt);

    return message.channel.send(botEmbed);
}

module.exports.help = {
    name: "botInfo"
}

