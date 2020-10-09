const { DataTypes, Model } = require('sequelize');

module.exports = class CharacterSession extends Model {
    static init(sequelize) {
        return super.init({
            quest_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            quest_description: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            quest_name: {
                type: DataTypes.STRING(32),
                allowNull: false
            },
            server_id: {
                type: DataTypes.STRING(32),
                allowNull: false,
            }

        }, {
            tableName: 'quest',
            modelName: 'Quest',
            timestamps: true,
            sequelize
        })
    }
}