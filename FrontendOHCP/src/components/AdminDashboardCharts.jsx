import axiosInstance from '@/utils/axios';
import {
    ArcElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    ArcElement, Title, Tooltip, Legend
);

function AdminDashboardCharts() {
    const [chartData, setChartData] = useState({
        appointmentsOverTime: [],
        appointmentsByCareOption: []
    });

    useEffect(() => {
        axiosInstance.get('/api/admin/appointments/stats', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(res => setChartData(res.data))
            .catch(console.error);
    }, []);

    const lineData = {
        labels: chartData.appointmentsOverTime.map(d => {
            const [year, month] = d.month.split('-');
            return new Date(year, month - 1).toLocaleString('en-GB', { month: 'short', year: 'numeric' });
        }),
        datasets: [{
            label: 'Appointments Per Month',
            data: chartData.appointmentsOverTime.map(d => d.count),
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.3
        }]
    };

    const pieData = {
        labels: chartData.appointmentsByCareOption.map(c => c.careOption),
        datasets: [{
            data: chartData.appointmentsByCareOption.map(c => c.count),
            backgroundColor: [
                '#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1',
                '#17a2b8', '#fd7e14', '#20c997', '#6610f2', '#e83e8c'
            ]
        }]
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="bg-white p-4 shadow rounded">
                <h3 className="text-lg font-semibold mb-2">Appointments Over Time</h3>
                <div style={{ height: '300px' }}>
                    <Line
                        data={lineData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false, // necessary to honor container height
                            scales: {
                                x: {
                                    ticks: {
                                        autoSkip: false,
                                        maxRotation: 0,
                                        minRotation: 0,
                                    }
                                },
                                y: {
                                    beginAtZero: true
                                }
                            },
                            plugins: {
                                legend: {
                                    display: true
                                }
                            }
                        }}
                    />
                </div>
            </div>
            <div className="bg-white p-4 shadow rounded">
                <h3 className="text-lg font-semibold mb-2">Appointments by Care Option</h3>
                <Pie data={pieData} />
            </div>
        </div>
    );
}

export default AdminDashboardCharts;
