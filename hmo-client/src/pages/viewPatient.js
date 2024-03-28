import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function PatientDetailsModal({ visible, onHide, selectedPatient }) {
  return (
    <Dialog header="פרטי המטופל" visible={visible} onHide={onHide} style={{ width: '50vw' }}>
      {selectedPatient && (
        <div>
          <div className="patient-details-info">
            <h3>{`${selectedPatient.patient.firstName} ${selectedPatient.patient.lastName}`}</h3>
            <p><strong>תעודת זהות:</strong> {selectedPatient.patient.idNumber}</p>
            <p><strong>עיר:</strong> {selectedPatient.patient.city}</p>
            <p><strong>רחוב:</strong> {selectedPatient.patient.street}</p>
            <p><strong>מספר בניין:</strong> {selectedPatient.patient.building}</p>
            <p><strong>טלפון:</strong> {selectedPatient.patient.telephone}</p>
            <p><strong>פלאפון:</strong> {selectedPatient.patient.cellphone}</p>
            <p><strong>תאריך לידה:</strong> {selectedPatient.patient.birthDate}</p>
          </div>
          {selectedPatient.eventData && selectedPatient.eventData.length > 0 ? (
            <div className="event-data">
              <h3>מידע רפואי</h3>
              <DataTable value={selectedPatient.eventData}>
                <Column field="date" header="תאריך" />
                <Column field="event.eventName" header="אירוע" />
                <Column field="manufacturer" header="יצרן" />
              </DataTable>
            </div>
          ) : (
            <p>אין מידע רפואי להציג</p>
          )}
        </div>
      )}
    </Dialog>
  );
}
