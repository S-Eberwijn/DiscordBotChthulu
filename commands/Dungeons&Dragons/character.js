const { MessageEmbed } = require('discord.js');
const PlayerCharacter = require('../../database/models/PlayerCharacter');


module.exports.run = async (bot, message, args) => {
    const user = message.mentions.users.first() || message.author;
    let character = await PlayerCharacter.findOne({ where: { player_id: user.id } })
    if (character) {

        let characterTitle = await getCharacterFullName(character);

        console.log(characterTitle);
        const characterEmbed = new MessageEmbed()
            .setColor(0x333333)
            .attachFiles([`./images/DnD/CharacterLevel/${character.get('level')}.png`])
            .setThumbnail(`attachment://${character.get('level')}.png`)
            .setTitle(characterTitle)
            .setImage(character.get('picture_url'))
            .setDescription(character.get('description'))
            .addFields(
                { name: '\*\*RACE\*\*', value: `${character.get('race')}`, inline: true },
                { name: '\*\*CLASS\*\*', value: `${character.get('class')}`, inline: true },
                { name: '\*\*AGE\*\*', value: `${character.get('age')}`, inline: true }
            );

        message.channel.send(characterEmbed);
    } else {
        message.channel.send('This user does not have a character!');
    }



}

module.exports.help = {
    name: "character",
    description: "Displays your (or the user you mentioned) character!",
    category: "TEST"
}

function hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
}

function getCharacterFullName(character) {
    let characterTitle = ''
    if (character.get('title')) {
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