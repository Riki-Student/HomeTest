const { sequelize, DataTypes } = require("./sequelize");
const patients = sequelize.define(
    "patient",
    {
        patientID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            unique: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        idNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        street: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        building:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        telephone:{
            type: DataTypes.STRING,
            allowNull: false
        },
        cellphone:{
            type: DataTypes.STRING,
            allowNull: true
        },
        birthDate:{
            type:DataTypes.DATEONLY,
            allowNull: false
        },
        img:{
            type:DataTypes.STRING,
            allowNull:true
        }
    },
    { 
        timestamps: false
    }
);
module.exports =patients;