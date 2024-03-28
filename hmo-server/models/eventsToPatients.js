const { sequelize, DataTypes } = require("./sequelize");
const eventsToPatients = sequelize.define(
    "eventsToPatient",
    {
        
        patientID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        eventID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        manufacturer: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    { 
        timestamps: false
    }
);
module.exports =eventsToPatients;