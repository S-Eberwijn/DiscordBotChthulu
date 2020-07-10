const { DataTypes, Model } = require('sequelize');

module.exports = class CharacterRequestSession extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            character_id: {
                type: DataTypes.STRING(32),
                allowNull: false
            },
            request_message_id: {
                type: DataTypes.STRING(32),
                allowNull: false
            }
        }, {
            tableName: 'character_request_session',
            modelName: 'CharacterRequestSession',
            timestamps: false,
            sequelize
        })
    }
}