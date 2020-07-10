const { DataTypes, Model } = require('sequelize');

module.exports = class CharacterSession extends Model {
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
            session_id: {
                type: DataTypes.STRING(32),
                allowNull: false
            }
        }, {
            tableName: 'character_session',
            modelName: 'CharacterSession',
            timestamps: false,
            sequelize
        })
    }
}