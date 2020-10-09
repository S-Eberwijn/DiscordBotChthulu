const { MessageEmbed } = require('discord.js');
const PlayerCharacter = require('../../database/models/PlayerCharacter');

module.exports.run = async (bot, message, args) => {
    //Returns the character of the message author or the mentioned user
    const user = message.mentions.users.first() || message.author;
    //Searches the database for a valid character
    let character = await PlayerCharacter.findOne({ where: { player_id: user.id, alive: 1, server_id: message.guild.id } })

    //If a character is linked to the user, return a character card
    if (!character) return message.channel.send('This user does not have a character!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
    const characterEmbed = new MessageEmbed()
        .setColor(0x333333)
        .attachFiles([`./images/DnD/CharacterLevel/${character.get('level')}.png`])
        .setThumbnail(`attachment://${character.get('level')}.png`)
        .setTitle(`${await getCharacterFullName(character)}(${character.get('age')})`)
        .setImage(character.get('picture_url'))
        .setDescription(character.get('description'))
        .addFields(
            { name: '\*\*RACE\*\*', value: `${character.get('race')}`, inline: true },
            { name: '\*\*CLASS\*\*', value: `${character.get('class')}`, inline: true },
            { name: '\*\*BACKGROUND\*\*', value: `${character.get('background')}`, inline: true }
        );
    message.channel.send(characterEmbed);

}

module.exports.help = {
    name: "character",
    description: "Displays your (or the user you mentioned) character!",
    category: "Dungeons & Dragons"
}

function getCharacterFullName(character) {
    let characterTitle = character.get('name');
    if (character.get('title')) {
        characterTitle = '';
        if (hasWhiteSpace(character.get('name'))) {
            let temporaryNameHolder = character.get('name').split(' ');
            for (let i = 0; i < temporaryNameHolder.length; i++) {
                characterTitle += temporaryNameHolder[i] + ' ';
                if (i === 0) {
                    characterTitle += `\"${character.get('title')}\" `;
                }
            }
        } else {
            characterTitle = `${character.get('name')} \"${character.get('title')}\"`;
        }
    }
    return characterTitle;
}

function hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
}
