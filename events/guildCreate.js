const GeneralInfo = require('../database/models/GeneralInfo');


module.exports = async (client, guild) => {
    await GeneralInfo.create({
        server_id: guild.id,
        session_number: 1,
    }).then(generalInfo => {
        let channels = [' ']
        generalInfo.in_character_channels = channels;
        generalInfo.save();
    })
};