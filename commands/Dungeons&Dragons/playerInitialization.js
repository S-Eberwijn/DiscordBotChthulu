const Player = require('../../database/models/Player');


module.exports.run = async (bot, message, args) => {
    let playerInitializationChannel = bot.channels.cache.find(c => c.name == "player-initialization" && c.type == "text");
    if (playerInitializationChannel) {
        if (playerInitializationChannel.id === message.channel.id) {
            if(args[0]){
                Player.create({
                    player_id: message.author.id,
                    player_name: args[0]
                });
            }
        }
    }


}

module.exports.help = {
    name: "player",
    description: "Type this commando in the \"player-initialization\" channel and initialize yourself as a Dungeons & Dragons player!",
    category: "Dungeons & Dragons"
}