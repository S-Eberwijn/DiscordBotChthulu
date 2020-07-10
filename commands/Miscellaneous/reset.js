module.exports.run = async (bot, message, args) => {

    message.channel.send('Resetting...')
    .then(msg => bot.destroy())
    .then(() => bot.login(process.env.TOKEN));

}

module.exports.help = {
    name: "reset",
    description: "Resets the bot",
    category: "Miscellaneous"
}