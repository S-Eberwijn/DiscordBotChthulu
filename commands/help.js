const discord = require('discord.js');
const botConfig = require('../botConfig.json');


module.exports.run = async (bot, message, args) => {
    // try {
    //     var text = "**__Commands__**\n" +
    //         "!bot - Get the bots info\n" +
    //         "!server - Get the server info\n" +
    //         "!database - Get all data records in database\n" +
    //         "!database <@user> - Get data from that specific user\n" +
    //         "!database <@user> <nickname> - Set nickname for that specific user\n" +
    //         "!database <@user> remove - Remove data entry for that user\n" +
    //         "!clear <number> - Delete n-number messages\n";
    //     message.author.send(text);
    //     message.channel.send("You can find the commands in a personal DM!");
    // } catch (error) {
    //     message.channel.send("Something went wrong!")
    // }

    let commandList = [];
    var prefix = botConfig.prefix;

    bot.commands.forEach(command => {

        let constructor = {
            name: command.help.name,
            description: command.help.description,
            category: command.help.category
        }

        commandList.push(constructor);
        
    });

    let response = "**Chthulu Commands**\n\n";
    let general = "**__General__**\n";
    let information = "\n**__Information__**\n";
    let dungeonsAndDragons = "\n**__Dungeons & Dragons__**\n";
    let miscellaneous = "\n**__Miscellaneous__**\n";

    for (let i = 0; i < commandList.length; i++) {
        const command = commandList[i];

        if (command["category"] == "General") {
            general += `${prefix}${command["name"]} - ${command["description"]}\n`;
        } else if (command["category"] == "Information"){
            information += `${prefix}${command["name"]} - ${command["description"]}\n`;
        } else if (command["category"] == "Dungeons & Dragons"){
            dungeonsAndDragons += `${prefix}${command["name"]} - ${command["description"]}\n`;
        } else if (command["category"] == "Miscellaneous"){
            miscellaneous += `${prefix}${command["name"]} - ${command["description"]}\n`;
        }
    }


    message.author.send(response + general + information + dungeonsAndDragons + miscellaneous).then(()=>{
        message.channel.send("You can find the commands in a personal DM! :mailbox_with_mail:");
    }).catch(()=>{
        message.channel.send("Something went wrong, turn on your personal messages");
    });


}

module.exports.help = {
    name: "help",
    description: "Gives all possible commands",
    category: "Information"
}