const prefix = process.env.PREFIX;

module.exports = async (bot, message) => {
    //Do nothing when bot sends message
    if (message.author.bot) return;
    //Do nothing when message is a direct message 
    if (message.channel.type === "dm") return;
 
    var messageArray = message.content.split(" ");
    var command = messageArray[0].toLowerCase();
    var arguments = messageArray.slice(1);
    var commands = bot.commands.get(command.slice(prefix.length));

    if (messageArray[0].charAt(0) === prefix.charAt(0)) {
        if (commands) commands.run(bot, message, arguments);
    } 
}