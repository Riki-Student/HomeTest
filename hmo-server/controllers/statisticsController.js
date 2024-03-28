const db = require('../models/index')
const { Op } = require('sequelize');
const Event = db.event
const EventToPatient = db.eventsToPatient


const getPastMonthSickCount = async (req, res) => {
  
    try {
        const pastMonthStartDate = new Date();
        pastMonthStartDate.setMonth(pastMonthStartDate.getMonth() - 1);
        const sickEvent = await Event.findOne({ where: { eventName: 'חולי' } });
        if (!sickEvent) {
            throw new Error('Event corresponding to illness not found');
        }

        const sickCounts = await EventToPatient.findAll({
            where: {
                eventID: sickEvent.eventID,
                date: { [Op.gte]: pastMonthStartDate }
            },
            attributes: [
                [EventToPatient.sequelize.fn('date', EventToPatient.sequelize.col('date')), 'date'],
                [EventToPatient.sequelize.fn('count', '*'), 'sickCount']
            ],
            group: [EventToPatient.sequelize.fn('date', EventToPatient.sequelize.col('date'))],
            order: [[EventToPatient.sequelize.fn('date', EventToPatient.sequelize.col('date')), 'ASC']]
        });

        res.json(sickCounts);
    } catch (error) {
        console.error('Error fetching sick counts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    
};


module.exports = {
    getPastMonthSickCount
};