const {renameNickname} = require('../otherFunctions/voiceNicknameUpdate.js');


module.exports = (bot, oldState, newState) => {
    renameNickname(oldState, newState);
}