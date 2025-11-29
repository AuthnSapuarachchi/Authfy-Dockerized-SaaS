import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';

// Generate mock data for different time periods
const generateData = (period) => {
  const now = new Date();
  const data = [];
  
  if (period === '7days') {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        name: days[date.getDay()],
        requests: Math.floor(Math.random() * 3000) + 2000,
        successful: Math.floor(Math.random() * 2800) + 1800,
        failed: Math.floor(Math.random() * 200) + 50
      });
    }
  } else if (period === '30days') {
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        name: `${date.getMonth() + 1}/${date.getDate()}`,
        requests: Math.floor(Math.random() * 5000) + 3000,
        successful: Math.floor(Math.random() * 4500) + 2700,
        failed: Math.floor(Math.random() * 300) + 100
      });
    }
  } else { // 24hours
    for (let i = 23; i >= 0; i--) {
      const hour = (now.getHours() - i + 24) % 24;
      data.push({
        name: `${hour}:00`,
        requests: Math.floor(Math.random() * 500) + 100,
        successful: Math.floor(Math.random() * 480) + 90,
        failed: Math.floor(Math.random() * 20) + 5
      });
    }
  }
  
  return data;
};

const UsageChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [chartType, setChartType] = useState('area');
  
  const data = useMemo(() => generateData(selectedPeriod), [selectedPeriod]);
  
  const totalRequests = useMemo(() => 
    data.reduce((sum, item) => sum + item.requests, 0),
    [data]
  );
  
  const avgRequests = useMemo(() => 
    Math.floor(totalRequests / data.length),
    [totalRequests, data.length]
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-3 border shadow-sm">
          <p className="fw-semibold mb-2">{payload[0].payload.name}</p>
          <p className="text-primary small mb-1">
            <span className="badge bg-primary me-2">Total:</span> {payload[0].value.toLocaleString()}
          </p>
          {payload[1] && (
            <p className="text-success small mb-1">
              <span className="badge bg-success me-2">Success:</span> {payload[1].value.toLocaleString()}
            </p>
          )}
          {payload[2] && (
            <p className="text-danger small">
              <span className="badge bg-danger me-2">Failed:</span> {payload[2].value.toLocaleString()}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 10, right: 10, left: 0, bottom: 0 }
    };

    if (chartType === 'area') {
      return (
        <AreaChart {...commonProps}>
          <defs>
            <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#0d6efd" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6c757d', fontSize: 12}} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#6c757d', fontSize: 12}} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="requests" stroke="#0d6efd" strokeWidth={2} fillOpacity={1} fill="url(#colorRequests)" />
        </AreaChart>
      );
    } else if (chartType === 'bar') {
      return (
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6c757d', fontSize: 12}} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#6c757d', fontSize: 12}} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="successful" stackId="a" fill="#198754" radius={[0, 0, 0, 0]} />
          <Bar dataKey="failed" stackId="a" fill="#dc3545" radius={[4, 4, 0, 0]} />
        </BarChart>
      );
    } else {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9ecef" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6c757d', fontSize: 12}} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#6c757d', fontSize: 12}} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="requests" stroke="#0d6efd" strokeWidth={2} dot={{ fill: '#0d6efd', r: 4 }} />
        </LineChart>
      );
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-3 mb-4">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
          <div>
            <h3 className="h5 fw-bold mb-2 d-flex align-items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              API Usage Analytics
            </h3>
            <p className="text-muted small mb-0">
              Total: <span className="fw-bold text-dark">{totalRequests.toLocaleString()}</span> requests • 
              Avg: <span className="fw-bold text-dark">{avgRequests.toLocaleString()}</span> per period
            </p>
          </div>
          <div className="d-flex gap-2">
            <div className="btn-group btn-group-sm" role="group">
              <button 
                className={`btn ${chartType === 'area' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setChartType('area')}
                title="Area Chart"
              >
                <BarChart3 size={16} />
              </button>
              <button 
                className={`btn ${chartType === 'bar' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setChartType('bar')}
                title="Bar Chart"
              >
                <BarChart3 size={16} />
              </button>
              <button 
                className={`btn ${chartType === 'line' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setChartType('line')}
                title="Line Chart"
              >
                <TrendingUp size={16} />
              </button>
            </div>
            <select 
              className="form-select form-select-sm" 
              style={{ width: 'auto' }}
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="24hours">Last 24 Hours</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>
        </div>
        
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UsageChart;