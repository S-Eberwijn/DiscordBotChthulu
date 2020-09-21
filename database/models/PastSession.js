const { DataTypes, Model } = require('sequelize');

module.exports = class PastSession extends Model {
    static init(sequelize) {
        return super.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            message_id: {
                type: DataTypes.STRING(),
                allowNull: false
            }, 
            session_commander_id: {
                type: DataTypes.STRING(32),
                allowNull: false
            },
            session_party: {
                type: DataTypes.STRING(255),
                allowNull: false,
                get() {
                    return this.getDataValue('session_party').split(';');
                },
                set(val) {
                    this.setDataValue('session_party', val.join(';'));
                }
            },
            date: {
                type: DataTypes.STRING(128),
                allowNull: false
            },
            dungeon_master_id: {
                type: DataTypes.STRING(),
                allowNull: false
            },
            objective: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            session_number: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            session_status: {
                type: DataTypes.STRING(16),
                allowNull: true
            }
        }, {
            tableName: 'past_session',
            modelName: 'PastSession',
            timestamps: true,
            sequelize
        })
    }
}