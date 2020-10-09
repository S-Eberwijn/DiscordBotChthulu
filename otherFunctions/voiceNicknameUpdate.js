const GeneralInfo = require('../database/models/GeneralInfo.js');
const PlayerCharacter = require('../database/models/PlayerCharacter');

//FIX THIS

exports.renameNickname = async function (oldState, newState) {
    if (oldState.channelID === newState.channelID) return;

    let player = await PlayerCharacter.findOne({ where: { player_id: newState.member.id, alive: 1, server_id: newState.guild.id } })
    let isValidChannel = false;
    await GeneralInfo.findOne({where: {server_id: newState.guild.id}}).then((foundServer) => {
        foundServer.get('in_character_channels').forEach(channel => {
            if (channel === newState.channelID){
                isValidChannel = true;
            }
        });
    });
    if (player) {
        if (isValidChannel && (newState.guild.me.hasPermission('MANAGE_NICKNAMES'))) {
            newState.member.setNickname(player.name);
        } else {
            newState.member.setNickname('');
        }
    }
}

