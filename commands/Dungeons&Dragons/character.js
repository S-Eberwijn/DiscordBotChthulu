const { MessageEmbed } = require('discord.js');
const PlayerCharacter = require('../../database/models/PlayerCharacter');


module.exports.run = async (bot, message, args) => {
    const user = message.mentions.users.first() || message.author;
    let character = await PlayerCharacter.findOne({ where: { player_id: user.id } })
    if (character) {
        const avatarEmbed = new MessageEmbed()
            .setColor(0x333333)
            .setTitle(character.get('name'))
            .setDescription(character.get('description'))
            .addFields(
                { name: '\_\_\*\*RACE\*\*\_\_', value: `${character.get('race')}`, inline: true },
                { name: '\_\_\*\*CLASS\*\*\_\_', value: `${character.get('class')}`, inline: true },
                { name: '\_\_\*\*AGE\*\*\_\_', value: `${character.get('age')}`, inline: true }
            )
            .setImage(character.get('picture_url'));
        message.channel.send(avatarEmbed);
    } else {
        message.channel.send('This user does not have a character!');
    }



}

module.exports.help = {
    name: "character",
    description: "Displays your (or the user you mentioned) character!",
    category: "TEST"
}