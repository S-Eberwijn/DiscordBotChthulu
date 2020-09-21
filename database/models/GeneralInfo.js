const { DataTypes, Model } = require('sequelize');

module.exports = class GeneralInfo extends Model {
    static init(sequelize) {
        return super.init({
            server_id: {
                type: DataTypes.STRING(32),
                allowNull: false,
            },
            session_number: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            in_character_channels: {
                type: DataTypes.STRING(256),
                allowNull: true,
                get(){
                    return this.getDataValue('in_character_channels').split(';');
                },
                set(val) {
                    this.setDataValue('in_character_channels', val.join(';'));
                }
            }
        }, {
            tableName: 'general_info',
            modelName: 'GeneralInfo',
            timestamps: false,
            sequelize
        })
    }
}