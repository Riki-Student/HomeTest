const { sequelize } = require("./sequelize");
const applyExtraSetup = () => {
    const { patient, event, eventsToPatient} = sequelize.models;
    
  
      eventsToPatient.belongsTo(event, { foreignKey: "eventID", as: "event" });
      event.hasMany(eventsToPatient, { foreignKey: "eventID", as: "eventsToPatient" });

    
    eventsToPatient.belongsTo(patient, { foreignKey: "patientID", as: "patient" });
    patient.hasMany(eventsToPatient, { foreignKey: "patientID", as: "eventsToPatient" });

    };
module.exports = { applyExtraSetup };