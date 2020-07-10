const { DataTypes, Model } = require('sequelize');

module.exports = class DungeonMaster extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            dungeon_master_id: {
                type: DataTypes.STRING(32),
                allowNull: false
            },
            dungeon_master_name: {
                type: DataTypes.STRING(64),
                allowNull: true
            }
        }, {
            tableName: 'dungeon_master',
            modelName: 'DungeonMaster',
            timestamps: false,
            sequelize
        })
    }
}