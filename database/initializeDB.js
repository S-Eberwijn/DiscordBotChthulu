const Player = require('./models/Player');
const CharacterRequestSession = require('./models/CharacterRequestSession');
const CharacterSession = require('./models/CharacterSession');
const DungeonMaster = require('./models/DungeonMaster');
const SessionRequest = require('./models/SessionRequest');
const PlayerCharacter = require('./models/PlayerCharacter');
const PlannedSession = require('./models/PlannedSession');




exports.initializeDB = function (db) {
    Player.init(db);
    //CharacterSession.init(db);
    //CharacterRequestSession.init(db);
    DungeonMaster.init(db);
    SessionRequest.init(db)
    PlayerCharacter.init(db);
    PlannedSession.init(db);

    Player.sync();
    //CharacterSession.sync();    
    //CharacterRequestSession.sync();
    DungeonMaster.sync();
    SessionRequest.sync();
    PlayerCharacter.sync();
    PlannedSession.sync();


    //SessionRequest.findAndCountAll().then(result => console.log(result.count));
    // Player.create({
    //     player_id: '241273372892200963',
    //     player_name: 'test'
    // });
    // CharacterRequestSession.create({
    //     character_id: 004,
    //     request_id: 224
    // });
}