import React, { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const GrapicsLineCabang = () => {
    const [percentage, setPercentage] = useState(0.0);
    
    const data = [
        { name: 'Jan', value: 0 },
        { name: 'Feb', value: 50 },
        { name: 'Mar', value: 100 },
        { name: 'Apr', value: 75 },
        { name: 'May', value: 125 },
    ];

    useEffect(() => {
        // Hitung persen perubahan dari data pertama ke terakhir
        const firstValue = data[0].value;
        const lastValue = data[data.length - 1].value;
        const percentageChange = ((lastValue - firstValue) / firstValue) * 100;
        setPercentage(percentageChange.toFixed(2));
    }, [data]);

    return (
        <div style={{ textAlign: 'center' }}>
            <h3>Graphic</h3>
            <ResponsiveContainer width="100%" height={100}>
                <LineChart data={data}>
                    <Line type="monotone" dataKey="value" stroke="#00C49F" strokeWidth={2} />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip />
                </LineChart>
            </ResponsiveContainer>
            <p style={{ color: 'green', fontWeight: 'bold' }}>+{percentage}%</p>
        </div>
    );
};

export default GrapicsLineCabang;
