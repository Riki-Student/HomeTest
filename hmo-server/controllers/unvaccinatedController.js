const db = require('../models/index');
const { Op } = require('sequelize');
const Event = db.event;
const Patient = db.patient;
const EventToPatient = db.eventsToPatient;

const getUnvaccinatedCount = async (req, res) => {
    try {
        // Find vaccination event
        const vaccinationEvent = await Event.findOne({ where: { eventName: 'חיסון' } });
        if (!vaccinationEvent) {
            throw new Error('Event corresponding to vaccination not found');
        }

        // Find patients who haven't received any vaccine
        const unvaccinatedCount = await Patient.count({
            include: [
                {
                    model: EventToPatient,
                    as: 'eventsToPatient',
                    where: {
                        eventID: vaccinationEvent.eventID
                    },
                    required: false
                }
            ],
            where: {
                '$eventsToPatient.patientID$': { [Op.is]: null }
            }
        });

        res.json({ unvaccinatedCount });
    } catch (error) {
        console.error('Error fetching unvaccinated count:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getUnvaccinatedCount
};
