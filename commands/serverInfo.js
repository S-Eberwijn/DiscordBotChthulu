const discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
    var serverEmbed = new discord.MessageEmbed()
        .setDescription("server info")
        .setColor("#229444")
        .setThumbnail(message.guild.iconURL)
        .addField("Bot name", bot.user.username)
        .addField("You joined at", message.member.joinedAt)
        .addField("Total Members", message.guild.memberCount);
    return message.channel.send(serverEmbed);
}

module.exports.help = {
    name: "serverInfo"
}

