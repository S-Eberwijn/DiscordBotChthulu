const {getUserFromMention} = require("./getUserFromMention");

exports.getSessionRequestPartyMembers = function (args, bot) {
    let partyMembers = [];
    while (args[0].startsWith('<@') && args[0].endsWith('>')) {
        partyMembers.push(getUserFromMention(args[0], bot));
        args.shift();
    }
    return partyMembers;
}

exports.getSessionRequestObjective = function (args) {
    let objective = '';
    while (args[0]) {
        objective += `${args[0]} `;
        args.shift();
    }
    return objective;
}

// exports.hexToDec = function (hexString) {
//     if (hexString.charAt(0) === "#"){
//         hexString = hexString.slice(1);
//     }
//     return parseInt(hexString, 16);
// }