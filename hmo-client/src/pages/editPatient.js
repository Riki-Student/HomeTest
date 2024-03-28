import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { InputText } from "primereact/inputtext";
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
export default function EditPatient() {
    console.log("hereee");
    const { id } = useParams()
    const [patientData, setPatientData] = useState('');
    const [firstName, setFirstName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [lastName, setLastName] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [street, setStreet] = useState('');
    const [building, setBuilding] = useState('');
    const [telephone, setTelephone] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedCity, setSelectedCity] = useState(null);
    const [vaccineDate1, setVaccineDate1] = useState(null);
    const [vaccineManufacturer1, setVaccineManufacturer1] = useState(null);
    const [vaccineDate2, setVaccineDate2] = useState(null);
    const [vaccineManufacturer2, setVaccineManufacturer2] = useState(null);
    const [vaccineDate3, setVaccineDate3] = useState(null);
    const [vaccineManufacturer3, setVaccineManufacturer3] = useState(null);
    const [vaccineDate4, setVaccineDate4] = useState(null);
    const [vaccineManufacturer4, setVaccineManufacturer4] = useState(null);
    const [illnessDate, setIllnessDate] = useState(null);
    const [recoveryDate, setRecoveryDate] = useState(null);

    const cities = [
        { name: 'ירושלים', code: 'JLM' },
        { name: 'תל אביב', code: 'TLV' },
        { name: 'בני ברק', code: 'BB' },
        { name: 'רמת גן', code: 'RG' },
        { name: 'בית שמש', code: 'BS' }
    ];

    const manufacturer = [
        { names: 'Pfizer', code: 'PR' },
        { names: 'Moderna', code: 'MA' },
        { names: 'AstraZeneca', code: 'AA' },
        { names: 'Novavax', code: 'NX' }
    ];


    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const response = await axios.get(`http://localhost:3600/api/patients/${id}`);
                setPatientData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching patient data:', error);
            }
        };

        fetchPatientData();
    }, []);

    const handleEdit = async () => {
        try {
            const response = await axios.put(`http://localhost:3600/api/patients/${id}`, {
                firstName,
                lastName,
                idNumber,
                city: selectedCity ? selectedCity.name : null,
                street,
                building,
                telephone,
                phone,
                birthDate: dateOfBirth,
                dateVaccine1: vaccineDate1,
                dateVaccine2: vaccineDate2,
                dateVaccine3: vaccineDate3,
                dateVaccine4: vaccineDate4,
                illnessDate,
                recoveryDate,
                manufacturer1: vaccineManufacturer1 ? vaccineManufacturer1.names : null,
                manufacturer2: vaccineManufacturer2 ? vaccineManufacturer2.names : null,
                manufacturer3: vaccineManufacturer3 ? vaccineManufacturer3.names : null,
                manufacturer4: vaccineManufacturer4 ? vaccineManufacturer4.names : null,
            });
            console.log('New patient created:', response.data);
            // Redirect to the desired page after successful submission
            navigate('/successEditPatient');
        } catch (error) {
            console.error('Error creating patient:', error);
        }
    };


    return (
        <>
            <div className="container mx-auto px-4">

                {/* Personal Details */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-2">עדכון פרטים אישיים</h3>
                    <InputText id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={patientData.patient ? patientData.patient.firstName : ''} /><br></br>
                    <InputText id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={patientData.patient ? patientData.patient.lastName : ''} /><br></br>
                    <InputText keyfilter="int" id="idNumber" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder={patientData.patient ? patientData.patient.idNumber : ''} /><br></br>

                    <InputText keyfilter="int" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={patientData.patient ? patientData.patient.cellphone : ''} /><br></br>
                    <InputText keyfilter="int" value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder={patientData.patient ? patientData.patient.telephone : ''} /><br></br>

                    <Calendar id="dateOfBirth" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.value)} placeholder={patientData.patient ? patientData.patient.birthDate : ''} />
                </div>

                {/* Address */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-2">עדכון כתובת</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Dropdown id="city" value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name"
                            editable placeholder={patientData.patient ? patientData.patient.city : ''} /><br></br>
                        <InputText id="street" value={street} onChange={(e) => setStreet(e.target.value)} placeholder={patientData.patient ? patientData.patient.street : ''} /><br></br>
                        <InputText id="buildingNumber" value={building} onChange={(e) => setBuilding(e.target.value)} keyfilter="int" placeholder={patientData.patient ? patientData.patient.building : ''} />
                    </div>
                </div>

                {/* Vaccination Details */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-2">עדכון פרטי חיסונים </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Dropdown value={vaccineManufacturer1} onChange={(e) => setVaccineManufacturer1(e.value)} options={manufacturer} optionLabel="names"
                            editable placeholder={patientData.eventData?.length >= 1 && patientData.eventData[0].event.eventID == 1 ? patientData.eventData[0].manufacturer : 'בחר יצרן'} />

                        <Calendar value={vaccineDate1} onChange={(e) => setVaccineDate1(e.value)} placeholder={patientData.eventData?.length >= 1 && patientData.eventData[0].event.eventID == 1 ? patientData.eventData[0].date : 'תאריך חיסון ראשון'} /><br></br>

                        <Dropdown value={vaccineManufacturer2} onChange={(e) => setVaccineManufacturer2(e.value)} options={manufacturer} optionLabel="names"
                            editable placeholder={patientData.eventData?.length >= 2 && patientData.eventData[1].event.eventID == 1 ? patientData.eventData[1].manufacturer : 'בחר יצרן'} />

                        <Calendar value={vaccineDate2} onChange={(e) => setVaccineDate2(e.value)} placeholder={patientData.eventData?.length >= 2 && patientData.eventData[1].event.eventID == 1 ? patientData.eventData[1].date : 'תאריך חיסון שני'} /><br></br>

                        <Dropdown value={vaccineManufacturer3} onChange={(e) => setVaccineManufacturer3(e.value)} options={manufacturer} optionLabel="names"
                            editable placeholder={patientData.eventData?.length >= 3 && patientData.eventData[2].event.eventID == 1 ? patientData.eventData[2].manufacturer : 'בחר יצרן'} />

                        <Calendar value={vaccineDate3} onChange={(e) => setVaccineDate3(e.value)} placeholder={patientData.eventData?.length >= 3 && patientData.eventData[2].event.eventID == 1 ? patientData.eventData[2].date : 'תאריך חיסון שלישי'} /><br></br>

                        <Dropdown value={vaccineManufacturer4} onChange={(e) => setVaccineManufacturer4(e.value)} options={manufacturer} optionLabel="names"
                            editable placeholder={patientData.eventData?.length >= 4 && patientData.eventData[3].event.eventID == 1 ? patientData.eventData[3].manufacturer : 'בחר יצרן'} />

                        <Calendar value={vaccineDate4} onChange={(e) => setVaccineDate4(e.value)} placeholder={patientData.eventData?.length >= 4 && patientData.eventData[3].event.eventID == 1 ? patientData.eventData[3].date : 'תאריך חיסון רביעי'} /><br></br>


                    </div>
                </div>

                {/* Other Medical Details */}
                <div>
                    <h3 className="text-xl font-semibold mb-2">פרטים רפואיים נוספים</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Calendar id="recoveryDate" value={recoveryDate} onChange={(e) => setRecoveryDate(e.value)} placeholder={
                            patientData.eventData && patientData.eventData.find(event => event.event.eventID === 3)
                                ? patientData.eventData.find(event => event.event.eventID === 3).date
                                : 'תאריך החלמה'
                        } />
                        <Calendar id="illnessDate" value={illnessDate} onChange={(e) => setIllnessDate(e.value)} placeholder={
                            patientData.eventData && patientData.eventData.find(event => event.event.eventID === 2)
                                ? patientData.eventData.find(event => event.event.eventID === 2).date
                                : 'תאריך תוצאה חיובת'
                        } />

                    </div>
                </div>
            </div><br></br>
            <div className="card flex justify-content-center">
                <Button label="שמור" onClick={handleEdit} icon="pi pi-check" />
            </div>

        </>
    );
}
