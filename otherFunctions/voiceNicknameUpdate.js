const GeneralInfo = require('../database/models/GeneralInfo.js');
const PlayerCharacter = require('../database/models/PlayerCharacter');
let fs = require('fs');


//FIX THIS
//

exports.renameNickname = async function (oldState, newState) {
    if (oldState.channelID === newState.channelID) return;

    let oldNickname = oldState.member.nickname || oldState.member.user.username;

    let playerObjects = require("../jsonDb/renameNickname.json");
    let inDatabase = false;
    let indexOfFoundUser;

    for (let i = 0; i < playerObjects['players'].length; i++) {
        if (playerObjects['players'][i] != null) {
            if (oldState.member.user.id === playerObjects['players'][i].userId && newState.guild.id === playerObjects['players'][i].serverId) {
                inDatabase = true;
                indexOfFoundUser = i;
            }
        }
    }

    let isInCharacterChannel = false;

    await GeneralInfo.findOne({ where: { server_id: newState.guild.id } }).then((foundServer) => {
        foundServer.get('in_character_channels').forEach(channel => {
            if (channel === newState.channelID) {
                isInCharacterChannel = true;
            }
        });
    });

    if (isInCharacterChannel) {
        let player = await PlayerCharacter.findOne({ where: { player_id: newState.member.id, alive: 1, server_id: newState.guild.id } })
        if (player) {
            if ((newState.guild.me.hasPermission('MANAGE_NICKNAMES'))) {
                if (!inDatabase) {
                    playerObjects['players'][playerObjects['players'].length] = {
                        userId: oldState.member.user.id,
                        serverId: newState.guild.id,
                        oldNickname: oldNickname
                    }
                }
                newState.member.setNickname(player.name);
            }
        }
    } else {
        if (inDatabase) {
            newState.member.setNickname(playerObjects['players'][indexOfFoundUser].oldNickname);
            playerObjects['players'].splice(indexOfFoundUser, 1);
        }
    }
    fs.writeFile("./jsonDb/renameNickname.json", JSON.stringify(playerObjects, null, 4), err => {
        if (err) throw err;
    });
}
