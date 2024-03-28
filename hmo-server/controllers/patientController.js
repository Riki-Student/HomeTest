const db = require('../models/index')
const Patient = db.patient
const Event = db.event
const EventToPatient = db.eventsToPatient


const getAllPatients = async (req, res) => {

    const patients = await Patient.findAll({})

    if (!patients?.length) {
        return res.status(400).json({ message: 'No patients found' })
    }
    res.json(patients)
}

const getPatientById = async (req, res) => {
    const id = req.params.id;
    try {
        // Find related data from EventToPatient table
        const eventData = await EventToPatient.findAll({
            where: { patientID: id },
            include: [{ model: Event, as: 'event' }]
        });

        // Sort events by date
        eventData.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Find the patient by ID
        const patient = await Patient.findByPk(id);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Return patient details along with related data
        res.json({ patient, eventData });
    } catch (error) {
        console.error('Error fetching patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const createNewPatient = async (req, res) => {

    const { firstName, lastName, birthDate, idNumber, city, street, building, telephone, phone, dateVaccine1, dateVaccine2, dateVaccine3, dateVaccine4, illnessDate, recoveryDate, manufacturer1, manufacturer2, manufacturer3, manufacturer4 } = req.body;

    const formatDates = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);

        // Return the formatted date string
        return `${year}-${month}-${day}`;
    }
    const formatbirthDate = formatDates(birthDate)
    const formatdateVaccine1 = formatDates(dateVaccine1)
    const formatdateVaccine2 = formatDates(dateVaccine2)
    const formatdateVaccine3 = formatDates(dateVaccine3)
    const formatdateVaccine4 = formatDates(dateVaccine4)
    const formatilnessDate = formatDates(illnessDate)
    const formatrecoveryDate = formatDates(recoveryDate)

    // Confirm data
    if (!firstName || !lastName || !idNumber || !city || !street || !building || !telephone || !phone || !formatbirthDate) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }
    try {
        // Create a new patient
        const patient = await Patient.create({ firstName, lastName, idNumber, city, street, building, telephone, cellphone: phone, birthDate: formatbirthDate });

        if (formatdateVaccine1 || formatdateVaccine2 || formatdateVaccine3 || formatdateVaccine4 || formatilnessDate || formatrecoveryDate) {
            const vaccine1 = dateVaccine1 ? await Event.findOne({ where: { eventName: "חיסון" } }) : null;
            console.log(vaccine1);
            const vaccine2 = dateVaccine2 ? await Event.findOne({ where: { eventName: "חיסון" } }) : null;
            const vaccine3 = dateVaccine3 ? await Event.findOne({ where: { eventName: "חיסון" } }) : null;
            const vaccine4 = dateVaccine4 ? await Event.findOne({ where: { eventName: "חיסון" } }) : null;
            const illnessEvent = illnessDate ? await Event.findOne({ where: { eventName: "חולי" } }) : null;
            const recoveryEvent = recoveryDate ? await Event.findOne({ where: { eventName: "החלמה" } }) : null;
            const patientDetails = await Patient.findOne({ where: { idNumber } });

            if (vaccine1) {
                console.log("vaccine1");
                console.log(manufacturer1);
                await EventToPatient.create({ patientID: patientDetails.patientID, eventID: vaccine1.eventID, date: formatdateVaccine1, manufacturer: manufacturer1 });
            }
            if (vaccine2) {
                console.log("vaccine2");
                await EventToPatient.create({ patientID: patientDetails.patientID, eventID: vaccine2.eventID, date: formatdateVaccine2, manufacturer: manufacturer2 });
            }
            if (vaccine3) {
                await EventToPatient.create({ patientID: patientDetails.patientID, eventID: vaccine3.eventID, date: formatdateVaccine3, manufacturer: manufacturer3 });
            }
            if (vaccine4) {
                await EventToPatient.create({ patientID: patientDetails.patientID, eventID: vaccine4.eventID, date: formatdateVaccine4, manufacturer: manufacturer4 });
            }
            if (illnessDate) {
                await EventToPatient.create({ patientID: patientDetails.patientID, eventID: illnessEvent.eventID, date: formatilnessDate });
            }
            if (recoveryDate) {
                await EventToPatient.create({ patientID: patientDetails.patientID, eventID: recoveryEvent.eventID, date: formatrecoveryDate });
            }
        }

        return res.status(201).json({ message: 'New patient created' });
    } catch (error) {
        console.error('Error creating patient:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



const updatePatient = async (req, res) => {
    const id = req.params.id;
    const { firstName, lastName, birthDate, idNumber, city, street, building, telephone, phone, dateVaccine1, dateVaccine2, dateVaccine3, dateVaccine4, illnessDate, recoveryDate, manufacturer1, manufacturer2, manufacturer3, manufacturer4 } = req.body;
    const formatDates = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);

        // Return the formatted date string
        return `${year}-${month}-${day}`;
    }

    try {
        const patient = await Patient.findByPk(id);
        const eventToPatients = await EventToPatient.findAll({ where: { patientID: id } });

        // Check if patient or eventToPatients is not found
        if (!patient) {
            return res.status(404).json({ message: 'Patient or EventToPatient not found' });
        }

        // Sort the eventToPatients array by date in ascending order
        const sortedEvents = eventToPatients?.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Update the patient's name if provided
        if (firstName) {
            patient.firstName = firstName;
        }
        if (lastName) {
            patient.lastName = lastName;
        }
        if (birthDate) {
            const formatbirthDate = formatDates(birthDate)
            patient.birthDate = formatbirthDate;
        }
        if (idNumber) {
            patient.idNumber = idNumber;
        }
        if (city) {
            patient.city = city;
        }
        if (street) {
            patient.street = street;
        }
        if (building) {
            patient.building = building;
        }
        if (telephone) {
            patient.telephone = telephone;
        }
        if (phone) {
            patient.phone = phone;
        }
        if (dateVaccine1 || manufacturer1) {
            if (sortedEvents[0]) {
                const firstVaccination = sortedEvents[0];
                if (dateVaccine1) {
                    firstVaccination.date = formatDates(dateVaccine1);
                }
                if (manufacturer1) {
                    firstVaccination.manufacturer = manufacturer1;
                }
                await firstVaccination.save()
            } else {
                await EventToPatient.create({ patientID: id, eventID: 1, date: formatDates(dateVaccine1), manufacturer: manufacturer1 });

            };

        }
        if (dateVaccine2 || manufacturer2) {
            if (sortedEvents[1]) {
                const secondVaccination = sortedEvents[1];
                if (dateVaccine2) {
                    secondVaccination.date = formatDates(dateVaccine2);
                }
                if (manufacturer2) {
                    secondVaccination.manufacturer = manufacturer2;
                }
                await secondVaccination.save()
            } else {
                await EventToPatient.create({ patientID: id, eventID: 1, date: formatDates(dateVaccine2), manufacturer: manufacturer2 });

            };
        }
        if (dateVaccine3 || manufacturer3) {
            if (sortedEvents[2]) {
                const thirdVaccination = sortedEvents[2];
                if (dateVaccine3) {
                    thirdVaccination.date = formatDates(dateVaccine3);
                }
                if (manufacturer3) {
                    thirdVaccination.manufacturer = manufacturer3;
                }
                await thirdVaccination.save()
            } else {
                await EventToPatient.create({ patientID: id, eventID: 1, date: formatDates(dateVaccine3), manufacturer: manufacturer3 });
            };
        }

        if (dateVaccine4 || manufacturer4) {
            if (sortedEvents[3]) {
                const forthVaccination = sortedEvents[3];
                if (dateVaccine4) {
                    forthVaccination.date = formatDates(dateVaccine4);
                }
                if (manufacturer4) {
                    forthVaccination.manufacturer = manufacturer4;
                }
                await forthVaccination.save()
            } else {
                await EventToPatient.create({ patientID: id, eventID: 1, date: formatDates(dateVaccine4), manufacturer: manufacturer4 });
            };
        }
        if (illnessDate) {
            let eventToPatient = await EventToPatient.findOne({ where: { patientID: id, eventID: 2 } });
            if (eventToPatient) {
                eventToPatient.date = formatDates(illnessDate);
                await eventToPatient.save();
            } else {
                eventToPatient = await EventToPatient.create({ patientID: id, eventID: 2, date: formatDates(illnessDate) });
            }
        }
        if (recoveryDate) {
            let eventToPatient = await EventToPatient.findOne({ where: { patientID: id, eventID: 3 } });
            if(eventToPatient){
                eventToPatient.date = formatDates(recoveryDate);
                await eventToPatient.save();
            }else {
                eventToPatient = await EventToPatient.create({ patientID: id, eventID: 3, date: formatDates(recoveryDate) });
            }

        }

        // Save the updated patient
        await patient.save();

        return res.json({ message: 'Patient updated successfully' });
    } catch (error) {
        console.error('Error updating patient:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deletePatient = async (req, res) => {
    const { patientID } = req.body;
    console.log(patientID);
    try {
        // Delete related records in eventToPatients table
        await EventToPatient.destroy({
            where: {
                patientID: patientID,
            }
        });

        // Now, delete the patient
        await Patient.destroy({
            where: {
                patientID: patientID,
            }
        });

        res.json('Successfully deleted');
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json('Error deleting patient');
    }
};

module.exports = {
    getAllPatients,
    getPatientById,
    createNewPatient,
    updatePatient,
    deletePatient
}
