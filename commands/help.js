const discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
    try {
        var text = "**__Commands__**\n" +
            "!bot - Get the bots info\n" +
            "!server - Get the server info\n" +
            "!database - Get all data records in database\n" +
            "!database <@user> - Get data from that specific user\n" +
            "!database <@user> <nickname> - Set nickname for that specific user\n" +
            "!database <@user> remove - Remove data entry for that user\n" +
            "!clear <number> - Delete n-number messages\n";
        message.author.send(text);
        message.channel.send("You can find the commands in a personal DM!");
    } catch (error) {
        message.channel.send("Something went wrong!")
    }
}

module.exports.help = {
    name: "help"
}