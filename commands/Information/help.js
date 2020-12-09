const { paginationEmbed } = require('../../otherFunctions/paginationEmbed');
const { MessageEmbed } = require('discord.js');
let categorizedCommands;
let iterationCounter;

module.exports.run = async (bot, message, args) => {
    iterationCounter = 1;
    let helpEmbed = new MessageEmbed()
        .setAuthor('Chthulu Commands', bot.user.displayAvatarURL())
        .setThumbnail(`https://upload.wikimedia.org/wikipedia/commons/3/38/4-Nature-Wallpapers-2014-1_ukaavUI.jpg`)

    let pages = [];

    if (!args[0]) {
        categorizedCommands = bot.commands.reduce((r, a) => {
            r[a.help.category] = [...r[a.help.category] || [], a];
            return r;
        }, {})

        Object.keys(categorizedCommands).forEach(key => {
            helpEmbed.setDescription(`\`\`\`${key}\`\`\``)
            categorizedCommands[key].forEach(command => {
                if (helpEmbed.fields.length === 24) {
                    pages.push(helpEmbed);
                    helpEmbed = new MessageEmbed()
                        .setAuthor('Chthulu Commands', bot.user.displayAvatarURL())
                        .setDescription(`\`\`\`${key}\`\`\``);
                }
                helpEmbed.addField(`\u200b`, `${process.env.PREFIX}${command.help.name}`, true);
                helpEmbed.addField('\u200b', '\u200b', true);
                helpEmbed.addField('\u200b', `${command.help.description}`, true);
            })
            pages.push(helpEmbed);
            helpEmbed = new MessageEmbed()
                .setAuthor('Chthulu Commands', bot.user.displayAvatarURL());
        });
        paginationEmbed(message, pages).catch(err => {
            message.channel.send("Something went wrong, contact my master...");
            console.log(err)
        });
    } else {
        if (!bot.commands.has(args[0])) return message.channel.send('I do not posses that command...').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
        let command = bot.commands.get(args[0]);
        helpEmbed.setDescription(`
        **__Command name:__** ${process.env.PREFIX}${command.help.name}
        **__Command description:__** ${command.help.description}
        **__Command usage:__** ${command.help.usage || `No additional parameter(s)`}
        **__Command permissions:__** ${command.help.permissions || `No additional permissions needed`}
        `)
        console.log(command);
        message.channel.send(helpEmbed).catch(err => {
            message.channel.send("Something went wrong, contact my master...");
            console.log(err)
        })
    }

}

module.exports.help = {
    name: "help",
    description: "Gives all possible commands",
    category: "Information"
}
