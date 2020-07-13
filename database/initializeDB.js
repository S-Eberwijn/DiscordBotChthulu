const Player = require('./models/Player');
const CharacterRequestSession = require('./models/CharacterRequestSession');
const CharacterSession = require('./models/CharacterSession');
const DungeonMaster = require('./models/DungeonMaster');
const SessionRequest = require('./models/SessionRequest');
const PlayerCharacter = require('./models/PlayerCharacter');
const PlannedSession = require('./models/PlannedSession');
const GeneralInfo = require('./models/GeneralInfo');



exports.initializeDB = function (db) {
    Player.init(db);
    //CharacterSession.init(db);
    //CharacterRequestSession.init(db);
    DungeonMaster.init(db);
    SessionRequest.init(db)
    PlayerCharacter.init(db);
    PlannedSession.init(db);
    GeneralInfo.init(db);

    Player.sync();
    //CharacterSession.sync();    
    //CharacterRequestSession.sync();
    DungeonMaster.sync();
    SessionRequest.sync();
    PlayerCharacter.sync();
    PlannedSession.sync();
    GeneralInfo.sync();


}