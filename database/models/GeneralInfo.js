const { DataTypes, Model } = require('sequelize');

module.exports = class GeneralInfo extends Model {
    static init(sequelize) {
        return super.init({
            session_number: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        }, {
            tableName: 'general_info',
            modelName: 'GeneralInfo',
            timestamps: false,
            sequelize
        })
    }
}