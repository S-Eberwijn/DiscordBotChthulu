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
                allowNull: false
            },
            server_id: {
                type: DataTypes.STRING(32),
                allowNull: false,
            }
        }, {
            tableName: 'player',
            modelName: 'Player',
            timestamps: true,
            sequelize
        })
    }
}