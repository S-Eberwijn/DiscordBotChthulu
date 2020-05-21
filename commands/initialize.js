const discord = require('discord.js');
let verifyChannel;

module.exports.run = async (bot, message, args) => {
    verifyChannel = bot.channels.cache.get('710220394849632361');

    

    var verifyEmbed = new discord.MessageEmbed()
        .setTitle(`Welcome to the ${message.guild.name}!`)
        .setDescription("server info")
        .setColor("#229444")
        .setThumbnail(message.guild.iconURL)
        .addField("Bot name", bot.user.username)
        .addField("You joined at", message.member.joinedAt)
        .addField("Total Members", message.guild.memberCount);
    
    


    
    verifyChannel.send(verifyEmbed);
    
}

module.exports.help = {
    name: "initialize"
}