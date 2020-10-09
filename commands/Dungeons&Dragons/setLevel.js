const PlayerCharacter = require('../../database/models/PlayerCharacter');

module.exports.run = async (bot, message, args) => {
    if (!message.member.roles.cache.find(role => role.name.includes('Dungeon Master'))) return message.channel.send('You shall not be setting ones level!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
    if (!message.mentions.users.first()) return message.channel.send('Try again, this time provide a player mention!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
    const character = await PlayerCharacter.findOne({ where: { player_id: message.mentions.users.first().id, server_id: message.guild.id } })
    if (!character) return message.channel.send('Did not find a suitable character in the database!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
    if (!(args[1] && args.length < 3 && typeof parseInt(args[1]) === 'number' && parseInt(args[1]) <= 20 && parseInt(args[1]) >= 1)) return message.channel.send('Provide a number (1 - 20)!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));

    PlayerCharacter.update(
        { level: args[1] },
        {
            where: { player_id: message.mentions.users.first().id, alive: 1, server_id: message.guild.id }
        });
}

module.exports.help = {
    name: "setLevel",
    description: "A DM can set a players character level",
    category: "Dungeons & Dragons"
}