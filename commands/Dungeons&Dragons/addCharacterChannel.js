const GeneralInfo = require('../../database/models/GeneralInfo');

module.exports.run = async (bot, message, args) => {
    if (!args[0]) return message.reply("Not enough valid arguments\nCorrect format: !addCharacterChannel <Channel Name>");

    if (message.guild.channels.cache.find(channel => channel.name === `${args[0]}`)) {
        let channelID = message.guild.channels.cache.find(channel => channel.name === `${args[0]}`).id;
        let foundServer = await GeneralInfo.findOne({where: {server_id: message.guild.id}})
        if (foundServer){
            if (foundServer.in_character_channels != null){
                let inCharacterChannels = foundServer.get('in_character_channels');
                inCharacterChannels.push(channelID)
                foundServer.in_character_channels = inCharacterChannels;
                foundServer.save();
            } else {
                foundServer.in_character_channels = channelID;
                foundServer.save();
            }   
        } else {
            return message.reply("**ERROR**: Could not find server in the database!");
        }
    } else {
        return message.reply("**ERROR**: There is no such channel. Maybe you made a typo?");
    }
}

module.exports.help = {
    name: "addCharacterChannel",
    description: "Template for new commands",
    category: "TEST"
}