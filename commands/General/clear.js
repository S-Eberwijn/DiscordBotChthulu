module.exports.run = async (bot, message, args) => {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You dont have the right permission!");
    if (!args[0]) return message.reply("Use: !clear <number>");

    if (Number.isInteger(parseInt(args[0]))) {
        var amount = parseInt(args[0]) + 1;
        message.channel.bulkDelete(amount).then(() => {
            if (args[0] === '0') {
                message.channel.send(`Cant delete 0 messages!`).then(msg => msg.delete({ timeout: 3000 }));
            } else if (args[0] === '1') {
                message.channel.send(`${args[0]} message deleted!`).then(msg => msg.delete({ timeout: 3000 }));
            } else {
                message.channel.send(`${args[0]} messages deleted!`).then(msg => msg.delete({ timeout: 3000 }));
            }
        })
    } else return message.channel.send("Only use numbers!").then(msg => msg.delete({ timeout: 3000 }));
}

module.exports.help = {
    name: "clear",
    description: "Clears n-number of messages",
    category: "General"
}