const { MessageEmbed } = require('discord.js');

module.exports.run = async (bot, message, args) => {
    const user = message.mentions.users.first() || message.author;
    const userAvatarURL = user.avatarURL({dynamic:true, size:1024});
    const avatarEmbed = new MessageEmbed()
        .setColor(0x333333)
        .setAuthor(user.username)
        .setImage(userAvatarURL);
    message.channel.send(avatarEmbed);
}

module.exports.help = {
    name: "avatar",
    alias: [],
    description: "Shows the avatar",
    category: "General"
}

