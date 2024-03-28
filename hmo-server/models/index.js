const{Sequelize}= require('sequelize');
const{sequelize}= require('./sequelize');
const {applyExtraSetup} = require('./extra-setup')

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize
//insert all tables
db.patient = require('./patient')
db.event = require('./events')
db.eventsToPatient = require('./eventsToPatients')

applyExtraSetup();
console.log('Before sync');
db.sequelize.sync({ alter: true })
.then(() => {
console.log('yes re-sync done!')
})
module.exports = db