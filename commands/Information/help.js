const { MessageEmbed } = require('discord.js');

module.exports.run = async (bot, message, args) => {

    let commandList = [];
    var prefix = process.env.PREFIX;

    bot.commands.forEach(command => {
        let constructor = {
            name: command.help.name,
            description: command.help.description,
            category: command.help.category
        }

        commandList.push(constructor);
    });

    let general = "";
    let information = "";
    let dungeonsAndDragons = "";
    let miscellaneous = "";

    for (let i = 0; i < commandList.length; i++) {
        const command = commandList[i];

        if (command["category"] == "General") {
            general += `${prefix}${command["name"]} - ${command["description"]}\n`;
        } else if (command["category"] == "Information") {
            information += `${prefix}${command["name"]} - ${command["description"]}\n`;
        } else if (command["category"] == "Dungeons & Dragons") {
            dungeonsAndDragons += `${prefix}${command["name"]} - ${command["description"]}\n`;
        } else if (command["category"] == "Miscellaneous") {
            miscellaneous += `${prefix}${command["name"]} - ${command["description"]}\n`;
        }
    }
    let helpEmbed = new MessageEmbed()
        .setAuthor('Chthulu Commands', bot.user.displayAvatarURL())
        //.setTitle('Chthulu Commands');
    if (general != "") {
        helpEmbed.addField("**__General__**\n", general);
    }
    if (information != "") {
        helpEmbed.addField("**__Information__**\n", information)
    }
    if (dungeonsAndDragons != "") {
        helpEmbed.addField("**__Dungeons & Dragons__**\n", dungeonsAndDragons)
    }
    if (miscellaneous != "") {
        helpEmbed.addField("**__Miscellaneous__**\n", miscellaneous)
    }

    message.author.send(helpEmbed).then(() => {
        message.channel.send("You can find the commands in a personal DM! :mailbox_with_mail:");
    }).catch(() => {
        message.channel.send("Something went wrong, turn on your personal messages");
    });
}

module.exports.help = {
    name: "help",
    description: "Gives all possible commands",
    category: "Information"
}