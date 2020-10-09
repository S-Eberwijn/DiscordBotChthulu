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
            name: {
                type: DataTypes.STRING(32),
                allowNull: false
            },
            title: {
                type: DataTypes.STRING(64),
                allowNull: true
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            race: {
                type: DataTypes.STRING(32),
                allowNull: false
            },
            class: {
                type: DataTypes.STRING(32),
                allowNull: false
            },
            background: {
                type: DataTypes.STRING(32),
                allowNull: false
            },
            age: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            level: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            next_session_id: {
                type: DataTypes.STRING(32),
                allowNull: true
            },
            last_session_id: {
                type: DataTypes.STRING(32),
                allowNull: true
            },
            picture_url: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            alive: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            server_id: {
                type: DataTypes.STRING(32),
                allowNull: false,
            }
        }, {
            tableName: 'player_character',
            modelName: 'PlayerCharacter',
            timestamps: true,
            sequelize
        })
    }
}