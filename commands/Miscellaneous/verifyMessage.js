const discord = require('discord.js');


module.exports.run = async (bot, message, args) => {

    let verifyMessage = new discord.MessageEmbed()
        .setAuthor(`🤖 ${bot.user.username}#${bot.user.discriminator} 🤖`)
        .setDescription(`I am here to serve my masters: \*\*${bot.users.cache.find(user => user.id === '241273372892200963').username}\*\* & \*\*${bot.users.cache.find(user => user.id === '228499662607351809').username}\*\*`)
        .addField("\_\_\*\*DESCIPTION\*\*\_\_", "Deep in the sea. I wanna swim. Leaving my worries. Far away from me. I need a break. I need to close my eyes. Go far away. And see the ancient skies. I need to know. If I'm still alive. Go far away. And see my roots are fine");
    
        message.channel.send(verifyMessage).then(message => {
            message.react('✅');
        });
}

module.exports.help = {
    name: "verifyMessage",
    description: "Creates a verification message so people can verify themselves",
    category: "TEST"
}