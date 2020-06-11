const { MessageEmbed } = require('discord.js');

module.exports.run = async (bot, message, args) => {
    let botCreation = bot.user.createdAt.toString().split(' ');

    var botEmbed = new MessageEmbed()
        .setAuthor(`🤖 ${bot.user.username}#${bot.user.discriminator} 🤖`)
        .setDescription(`I am here to serve my masters: \*\*${bot.users.cache.find(user => user.id === '241273372892200963').username}\*\* & \*\*${bot.users.cache.find(user => user.id === '228499662607351809').username}\*\*`)
        .setColor("#29e53f")
        .addField("\_\_\*\*DESCIPTION\*\*\_\_", "---------------------------------------------------------------------------\nDeep in the sea. I wanna swim. Leaving my worries. Far away from me. I need a break. I need to close my eyes. Go far away. And see the ancient skies. I need to know. If I'm still alive. Go far away. And see my roots are fine\n---------------------------------------------------------------------------")
        .setThumbnail(bot.user.displayAvatarURL())
        .addFields(
            { name: '\_\_\*\*BOT NAME\*\*\_\_', value: `${bot.user.username}`, inline: false },
            { name: '\_\_\*\*ACTIVE SERVERS\*\*\_\_', value: `Active in \*\*${bot.guilds.cache.size}\*\* server(s)`, inline: true }
        )
        .addFields(
            { name: '\_\_\*\*RESURRECTIONS\*\*\_\_', value: `I've been summoned \*\*${bot.ressurection['resurrections'].count}\*\* times`, inline: true },
            { name: '\_\_\*\*TIME ALIVE\*\*\_\_', value: `${calculateUptimeBot(bot)}`, inline: false },
            { name: '\u200B', value: '\u200B', inline: false}
        )
        .addField("\_\_\*\*CREATED AT\*\*\_\_", `${botCreation[0]}, ${botCreation[1]} ${botCreation[2]} ${botCreation[3]} ${botCreation[4]}`);
    return message.channel.send(botEmbed);
}

module.exports.help = {
    name: "bot",
    description: "Gives information about the bot",
    category: "Information"
}

function calculateUptimeBot(bot) {
    let totalSeconds = (bot.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    let uptime = `${seconds} seconds`;


    if (minutes != 0) {
        uptime = `${minutes} minutes and ${seconds} seconds`;
    }
    if (hours != 0) {
        uptime = `${hours} hours, ${minutes} minutes and ${seconds} seconds`;
    }
    if (days != 0) {
        uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
    }

    return uptime;

}
