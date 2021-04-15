const { MessageEmbed } = require('discord.js');

module.exports.run = async (bot, message, args) => {
    let sicon = message.guild.iconURL;
    let serverembed = new MessageEmbed()
        .setDescription("Server Information")
        .setColor("#ff0000")
        .setThumbnail(sicon)
        .addField("Server Name", message.guild.name)
        .addField("Created On", message.guild.createdAt)
        .addField("You Joined", message.member.joinedAt)
        .addField("Total Members", message.guild.memberCount);
        
    message.channel.send(serverembed);
}

module.exports.help = {
    name: "serverInfo",
    alias: [],
    description: "Gives information about the discord server",
    category: "Information"
}

