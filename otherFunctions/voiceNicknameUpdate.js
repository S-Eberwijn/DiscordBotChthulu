const fs = require('fs');
const nameTrackerJson = './jsonDb/nameTracker.json';
const {writeToJsonDb} = require('../otherFunctions/writeToJsonDb.js');


exports.renameNickname = function (oldState,newState){
    //if user has not switched channels
    if (oldState.channelID === newState.channelID) return;
    
    /* check if the user is entering a voice chat from text. This is done to determine if we need to update their default nickname.
    * If they are entering a voice channel from nothing, updateNick will be true.
    * If they are swapping between voice channels, updateNick will be false.
    * If they are leaving a voice channel to return to just text, updateNick will be false.
    */
    let oldvoice = false;
    let newvoice = false;
    try {
        oldvoice = oldState.channel.type == 'voice';
    } catch (err) { /*Swallow the exception, the user is not in a "valid" channel, assuming not voice*/ }
    try { 
        newvoice = newState.channel.type == 'voice';
    } catch (err) { /*Swallow the exception, the user is not in a "valid" channel, assuming not voice*/ }
    let updateNick = !oldvoice && newvoice;
    
    //Load the nickname JSON file
    var nickJSON = fs.readFileSync(nameTrackerJson);
    nickJSON = JSON.parse(nickJSON);
    
    //Check if userid is in registrations
    if (!nickJSON.players) return;
    nickJSON.players.forEach(player => {
        if (player.userid === newState.member.id) {
            //check the stored default nickname against the current nickname
            //only update the nickname if we are going from no voice channel to a voice channel
            if (player.name != oldState.member.nickname && updateNick) {
                player.name = oldState.member.nickname;
                writeToJsonDb("nameTracker",nickJSON);
            }
            for (let i = 0; i < player.registrations.length; i++) {
                if (player.registrations[i].channelid === newState.channelID && (newState.guild.me.hasPermission('MANAGE_NICKNAMES'))) {
                    newState.member.setNickname(player.registrations[i].nickname)
                    return;
                } else {
                   newState.member.setNickname('');
                 }
            }
            newState.member.setNickname(player.name)
        }
    });
}

