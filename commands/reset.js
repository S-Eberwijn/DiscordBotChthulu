const discord = require('discord.js');
const botConfig = require('../botConfig.json');


module.exports.run = async (bot, message, args) => {

    message.channel.send('Resetting...')
    .then(msg => bot.destroy())
    .then(() => bot.login(botConfig.token));

}

module.exports.help = {
    name: "reset",
    description: "Resets the bot",
    category: "Miscellaneous"
}