import React from "react";
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface LineGraphProps {
    data: number[];
    labels: string[];
}

const LineGraph: React.FC<LineGraphProps> = ({ data, labels }) => {
    const getLineColor = (data: number[]) => {
        return data[data.length - 1] >= data[0] ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'; // Green if rising, Red if falling
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,  // Hide legend
            },
            tooltip: {
                enabled: false, // Disable tooltips
            },
        },
        scales: {
            x: {
                display: false,  // Hide x-axis
            },
            y: {
                display: false,  // Hide y-axis
            },
        },
    };

    return (
        <div className="w-40">
            <Line 
                data={{
                    labels: labels,
                    datasets: [
                        {
                            label: 'Pengunjung',
                            data: data,
                            borderColor: getLineColor(data),
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            tension: 0.4,
                        },
                    ],
                }} 
                options={chartOptions} 
            />
        </div>
    );
};

export default LineGraph;
