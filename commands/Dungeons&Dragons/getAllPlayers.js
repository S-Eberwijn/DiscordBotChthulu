const discord = require('discord.js');

const Player = require('../../database/models/Player');
const db = require('../../database/database');
let players;

module.exports.run = async (bot, message, args) => {

    db.authenticate().then(async () => {
        // players = await Player.findAll({
        //     where: {
        //         id: [1, 2, 3]
        //     }
        // });

        // if (players) {
        //     for (let i = 0; i < players.length; i++) {
        //         message.channel.send(players[i].player_name);
        //     }
        // }
        players = await Player.findOne({
            where: { id: 1}
        });
        console.log(players.dataValues.id);
       
        //console.log(players.every(player => player instanceof Player)); // true
        // console.log(players.length)
        // console.log("All users:", JSON.stringify(players, null, 2));

    }).catch(err => console.log(err));

}

module.exports.help = {
    name: "testje",
    description: "Gets all players in Hexmarches",
    category: "TEST"
}