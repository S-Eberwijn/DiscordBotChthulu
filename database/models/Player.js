const { DataTypes, Model } = require('sequelize');

module.exports = class Player extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            player_id: {
                type: DataTypes.STRING(32),
                allowNull: false
            },
            player_name: {
                type: DataTypes.STRING(32),
                allowNull: true
            },
            latest_character_img: {
                type: DataTypes.STRING(255),
                allowNull: true
            }
        }, {
            tableName: 'player',
            modelName: 'Player',
            timestamps: true,
            sequelize
        })
    }
}