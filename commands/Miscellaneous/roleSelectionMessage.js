const { MessageEmbed } = require('discord.js');






module.exports.run = async (bot, message, args) => {
    const minecraftRole = message.guild.roles.cache.get('730468859286650920');
    const leagueOfLegendsRole = message.guild.roles.cache.get('730468912805838979');;
    const dungeonsAndDragonsRole = message.guild.roles.cache.get('730468964215554148');


    let verifyMessage = new MessageEmbed()
        .setTitle('Choose the role(s) that suit you best!')
        .setDescription(`
        
        ${bot.emojis.cache.get('730470963002736660')} - ${minecraftRole.toString()}
        ${bot.emojis.cache.get('730470991473541201')} - ${leagueOfLegendsRole.toString()}
        ${'🐉'} - ${dungeonsAndDragonsRole.toString()}

        `)
        .setColor('#228B22');
    message.channel.send(verifyMessage).then(async message => {
        await message.edit(message.embeds[0].setFooter(`ID: ${message.id}`));

        await message.react('730470963002736660');
        await message.react('730470991473541201');
        await message.react('🐉');
    });
    message.delete();
}

module.exports.help = {
    name: "roleSelectMessage",
    description: "Creates a role selection message so people can give themselves roles",
    category: "TEST"
}