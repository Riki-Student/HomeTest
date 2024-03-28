import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function ShowStatistics() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [sicks, setSicks] = useState([]);
    const [unvaccinatedCount, setUnvaccinatedCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`http://localhost:3600/api/statistics`);
                setSicks(response.data);

                const unvaccinatedResponse = await axios.get(`http://localhost:3600/api/unvaccinated`);
                setUnvaccinatedCount(unvaccinatedResponse.data.unvaccinatedCount);
                console.log(unvaccinatedResponse.data.unvaccinatedCount);

                const data = {
                    labels: response.data.map(entry => entry.date),
                    datasets: [
                        {
                            label: 'מספר חולים',
                            data: response.data.map(entry => entry.sickCount),
                            backgroundColor: 'rgba(255, 159, 64, 0.2)',
                            borderColor: 'rgb(255, 159, 64)',
                            borderWidth: 1
                        }
                    ]
                };
                const options = {
                    scales: {
                        y: {
                            beginAtZero: true,
                            stepSize: 1, // Set step size to 1 to display only integers
                            title: {
                                display: true,
                                text: 'מספר חולים'
                            },
                            ticks: {
                                precision: 0 // Set precision to 0 to display only integer numbers
                            }
                        }
                    }
                };

                setChartData(data);
                setChartOptions(options);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        }
        fetchData();
    }, []);

    return (
        <>
            <h1>סטטיסטיקות</h1>
            <h2>מספר חברי קופה לא מחוסנים: {unvaccinatedCount}</h2> {/* Display unvaccinated count */}
            
            <div className="card">
                <div className="containerStatistics">
                <Chart type="bar" data={chartData} options={chartOptions} style={{width: '600px', height: '600px'}} />
                <Link to="/Home">חזור לדף הבית</Link></div>
            </div>
            
        </>
    );
}
