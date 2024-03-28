import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import PatientDetailsModal from './viewPatient';
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import { FileUpload } from 'primereact/fileupload';


export default function Home() {
  const [patients, setPatients] = useState([]);
  const [patientDetails, setPatientDetails] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectFile, setSelectFile] = useState(null)
  const [imageUploaded, setImageUploaded] = useState(false); // State to track if image is uploaded

  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`http://localhost:3600/api/patients`);
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    }
    fetchData();
  }, [selectFile, imageUploaded]);

  const handleUpload = (event) => {
    setSelectFile(event.files[0]); // Update selectFile state with the selected file
  };

  const addNewPatient = () => {
    navigate(`/newPatient`)
  }

  const showStatistics = () => {
    navigate(`/statistics`)
  }

  const handlePatientClick = async (patient) => {
    try {
      const response = await axios.get(`http://localhost:3600/api/patients/${patient.patientID}`);
      setPatientDetails(response.data);
    } catch (error) {
      console.error('Error fetching patient:', error);
    }
  };

  const handleEdit = (rowData) => {
    navigate(`/editPatient/${rowData.patientID}`)
  }

  const handleDelete = (rowData) => {
    confirmDialog({
      message: '?האם הנך בטוח כי ברצונך למחוק את הנתונים',
      header: 'וידוא מחיקה',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      acceptLabel: 'כן',
      rejectLabel: 'לא',
      accept: async () => {
        try {
          await axios.delete(`http://localhost:3600/api/patients`, {
            data: { patientID: rowData.patientID }
          });
          console.log('Delete action triggered for:', rowData);
          const response = await axios.get(`http://localhost:3600/api/patients`);
          setPatients(response.data);
        } catch (error) {
          console.error('Error deleting patient:', error);
        }
      }
    });
  };

  const handleImageUpload = async (patientID) => {
    try {
      const formData = new FormData();
      formData.append('file', selectFile);
      const response = await axios.post(`http://localhost:3600/api/uploadImage/${patientID}`, formData);
      console.log('Image uploaded successfully:', response.data);
      setImageUploaded(true);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const imageUploadColumn = (rowData) => {
    return (
      <>
        <div className="card flex justify-content-center">
          <div className="flex">
            <FileUpload
              mode="basic"
              chooseLabel="בחר תמונה"
              accept="image/*"
              maxFileSize={1000000} // Adjust as needed
              onSelect={handleUpload}
              style={{ padding: '0.25rem 0.5rem' }}
            />
            <Button
              label="הצגת תמונה"
              icon="pi pi-upload"
              onClick={() => handleImageUpload(rowData.patientID)}
            />
          </div>
        </div>
      </>
    );
  };

  const displayImage = (rowData) => {
    const imageUrl = `http://localhost:3600/images/${rowData.img}`;
    return (
      <>
        <div>{rowData.img && <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100px', maxHeight: '100px' }} />}</div>
      </>
    );
  }

  return (
    <>
      <h2>מערכת ניהול קורונה לקופת חולים</h2>
      <div className="card">
        <DataTable value={patients} selection={selectedPatient} onSelectionChange={(e) => setSelectedPatient(e.value)} dataKey="id">
          <Column field="delete"
            body={(rowData) => (
              <IconButton onClick={() => handleDelete(rowData)}>
                <DeleteOutlineIcon></DeleteOutlineIcon>
              </IconButton>
            )}>
          </Column>
          <Column field="edit"
            body={(rowData) => (
              <IconButton onClick={() => { handleEdit(rowData) }}>
                <EditIcon></EditIcon>
              </IconButton>
            )}></Column>
          <Column field="view"
            body={(rowData) => (
              <IconButton onClick={() => handlePatientClick(rowData)}>
                <VisibilityIcon ></VisibilityIcon>
              </IconButton>
            )}
          ></Column>
          <Column field="idNumber" header="תעודת זהות"></Column>
          <Column field="lastName" header="שם משפחה"></Column>
          <Column field="firstName" header="שם פרטי"></Column>
          <Column field="תמונה" body={displayImage} style={{ textAlign: 'right' }}></Column>
          <Column body={imageUploadColumn} />

        </DataTable>
      </div><br></br>
      <div className="card flex justify-content-center">
        <div className="flex">
          <Button label="לצפייה בסטטיסטיקות" icon="pi pi-check" onClick={() => showStatistics()} style={{ marginRight: '10px' }}/>
          <Button label="הוסף חבר קופה חדש" icon="pi pi-check" onClick={() => addNewPatient()}  />
        </div>
      </div>

      <PatientDetailsModal
        visible={patientDetails !== null}
        onHide={() => setPatientDetails(null)}
        selectedPatient={patientDetails}
      />
      <ConfirmDialog /></>

  );
}
