const PlayerCharacter = require('../../database/models/PlayerCharacter');


module.exports.run = async (bot, message, args) => {

    if (message.member.roles.cache.find(role => role.name === 'Dungeon Master')) {
        const user = message.mentions.users.first();
        //TO DO: CHECK IF ARGS[1] IS A NUMBER!
        if (user) {
            let character = await PlayerCharacter.findOne({ where: { player_id: user.id } })
            if (character) {
                if(args[1]){
                    PlayerCharacter.update(
                        { level: args[1] },
                        { where: { player_id: user.id, alive: 1 }
                    });
                }
            } else {
                message.channel.send('Did not find a suitable character!');
            }
        } else {
            message.channel.send('Try again, this time with an user!');
        }
    } else {
        message.channel.send('You shall not be setting ones level!');
    }




}

module.exports.help = {
    name: "setLevel",
    description: "A DM can set a players character level",
    category: "Dungeons & Dragons"
}