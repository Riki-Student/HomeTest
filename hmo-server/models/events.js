const { sequelize, DataTypes } = require("./sequelize");
const events = sequelize.define(
    "event",
    {
        eventID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            unique: true,
            autoIncrement: true
        },
        eventName: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    { 
        timestamps: false
    }
);
module.exports =events;