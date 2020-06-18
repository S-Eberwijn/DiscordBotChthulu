const { MessageEmbed } = require('discord.js');


module.exports.run = async (bot, message, args) => {

    const user = message.mentions.users.first() || message.author;
    const avatarEmbed = new MessageEmbed()
        .setColor(0x333333)
        .setAuthor(user.username)
        .setImage(user.avatarURL());
    message.channel.send(avatarEmbed);

}

module.exports.help = {
    name: "avatar",
    description: "Shows the avatar",
    category: "General"
}