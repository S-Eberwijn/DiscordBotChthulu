const { MessageEmbed } = require('discord.js');
const Player = require('../../database/models/Player');
const PlayerCharacter = require('../../database/models/PlayerCharacter');


module.exports.run = async (bot, message, args) => {
    // console.log(message.attachments.entries().next().value[1].url)
    //console.log(message.attachments.entries().next())
    let characterCreationChannel = bot.channels.cache.find(c => c.name == "character-creation" && c.type == "text");

    if (characterCreationChannel) {
        if (characterCreationChannel.id === message.channel.id) {
            if (message.attachments.entries().next().value != undefined) {
                Player.update(
                    { latest_character_img: message.attachments.entries().next().value[1].url },
                    { where: { player_id: message.author.id } }
                );
            } else {
                //console.log(message);
                if (args[0].includes('new')) {
                    let foundPlayer = await Player.findOne({where: {player_id: message.author.id}})
                    let img_url = null;
                    if(foundPlayer){
                        img_url = foundPlayer.get('latest_character_img');
                    }

                    let messageValues = message.content.split('\n').splice(1);
                    //console.log(messageValues);
                    let characterName = messageValues[0].split('Name:')[1].trim();
                    let characterRace = messageValues[1].split('Race:')[1].trim();
                    let characterAge = parseInt(messageValues[2].split('Age:')[1].trim());
                    let characterClass = messageValues[3].split('Class:')[1].trim();
                    let characterShortStory = messageValues[4].split('Short-story:')[1].trim();;

                    PlayerCharacter.create({
                        player_id: message.author.id,
                        description: characterShortStory,
                        race: characterRace,
                        class: characterClass,
                        name: characterName,
                        picture_url: img_url,
                        age: characterAge
                    });
                }
            }
        } 

    }







}

module.exports.help = {
    name: "characterCreate",
    description: "Template for new commands",
    category: "TEST"
}