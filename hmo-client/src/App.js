import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { PrimeReactProvider } from 'primereact/api'
import Home from "./pages/home"
import NewPatient from './pages/newPatient';
import SuccessCreatePatient from './pages/successCreatePatient';
import EditPatient from './pages/editPatient';
import SuccessEditPatient from './pages/successEditPatient';
import ShowStatistics from './pages/statistics';

function App() {
  return (
    <PrimeReactProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/editPatient/:id" element={<EditPatient />}></Route>
          <Route path='/home' element={<><Home /></>}></Route>
          <Route path='/newPatient' element={<><NewPatient /></>}></Route>
          <Route path='/successCreatePatient' element={<><SuccessCreatePatient /></>}></Route>
          <Route path='/successEditPatient' element={<SuccessEditPatient />}></Route>
          <Route path='/statistics' element={<ShowStatistics />}></Route>
        </Routes>
      </Router>
    </PrimeReactProvider>
  );
}

export default App;
