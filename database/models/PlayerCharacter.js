const { DataTypes, Model } = require('sequelize');

module.exports = class PlayerCharacter extends Model {
    static init(sequelize) {
        return super.init({
            character_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            player_id: {
                type: DataTypes.STRING(32),
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            race: {
                type: DataTypes.STRING(32),
                allowNull: true
            },
            class: {
                type: DataTypes.STRING(32),
                allowNull: true
            },
            level: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            next_session_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            last_session_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            name: {
                type: DataTypes.STRING(64),
                allowNull: false
            },
            picture_url: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            age: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            tableName: 'player_character',
            modelName: 'PlayerCharacter',
            timestamps: true,
            sequelize
        })
    }
}