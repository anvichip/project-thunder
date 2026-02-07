// src/components/AnalyticsDashboard.jsx - Professional Redesign
import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const viewsOverTime = [
    { date: 'Jan 1', views: 12, event: null },
    { date: 'Jan 3', views: 15, event: null },
    { date: 'Jan 5', views: 18, event: 'Resume Updated' },
    { date: 'Jan 7', views: 28, event: null },
    { date: 'Jan 9', views: 35, event: null },
    { date: 'Jan 11', views: 42, event: 'Applied to TechCorp' },
    { date: 'Jan 13', views: 65, event: null },
    { date: 'Jan 15', views: 58, event: null },
  ];

  const viewsBySource = [
    { source: 'LinkedIn', views: 145, color: '#0A66C2' },
    { source: 'Indeed', views: 98, color: '#3b82f6' },
    { source: 'Company Site', views: 76, color: '#8b5cf6' },
    { source: 'Direct Link', views: 54, color: '#ec4899' },
    { source: 'Other', views: 32, color: '#6b7280' },
  ];

  const heatmapData = [
    { day: 'Mon', '9AM': 8, '10AM': 15, '11AM': 22, '12PM': 18, '2PM': 25, '3PM': 30, '4PM': 20, '5PM': 12 },
    { day: 'Tue', '9AM': 12, '10AM': 20, '11AM': 28, '12PM': 22, '2PM': 32, '3PM': 35, '4PM': 25, '5PM': 15 },
    { day: 'Wed', '9AM': 10, '10AM': 18, '11AM': 25, '12PM': 20, '2PM': 28, '3PM': 32, '4PM': 22, '5PM': 14 },
    { day: 'Thu', '9AM': 14, '10AM': 22, '11AM': 30, '12PM': 25, '2PM': 35, '3PM': 38, '4PM': 28, '5PM': 18 },
    { day: 'Fri', '9AM': 16, '10AM': 24, '11AM': 20, '12PM': 15, '2PM': 22, '3PM': 18, '4PM': 12, '5PM': 8 },
  ];

  const engagementClusters = [
    { scrollDepth: 15, timeSpent: 8, cluster: 'Bounce', color: '#ef4444' },
    { scrollDepth: 20, timeSpent: 12, cluster: 'Bounce', color: '#ef4444' },
    { scrollDepth: 10, timeSpent: 5, cluster: 'Bounce', color: '#ef4444' },
    { scrollDepth: 25, timeSpent: 45, cluster: 'Stuck', color: '#f59e0b' },
    { scrollDepth: 30, timeSpent: 52, cluster: 'Stuck', color: '#f59e0b' },
    { scrollDepth: 28, timeSpent: 48, cluster: 'Stuck', color: '#f59e0b' },
    { scrollDepth: 85, timeSpent: 25, cluster: 'Skimmer', color: '#3b82f6' },
    { scrollDepth: 90, timeSpent: 30, cluster: 'Skimmer', color: '#3b82f6' },
    { scrollDepth: 95, timeSpent: 28, cluster: 'Skimmer', color: '#3b82f6' },
    { scrollDepth: 95, timeSpent: 120, cluster: 'Engaged', color: '#10b981' },
    { scrollDepth: 100, timeSpent: 145, cluster: 'Engaged', color: '#10b981' },
    { scrollDepth: 98, timeSpent: 135, cluster: 'Engaged', color: '#10b981' },
  ];

  const ctrOverTime = [
    { date: 'Jan 1', ctr: 12.5 },
    { date: 'Jan 3', ctr: 15.2 },
    { date: 'Jan 5', ctr: 18.8 },
    { date: 'Jan 7', ctr: 22.3 },
    { date: 'Jan 9', ctr: 25.6 },
    { date: 'Jan 11', ctr: 28.9 },
    { date: 'Jan 13', ctr: 32.1 },
    { date: 'Jan 15', ctr: 29.8 },
  ];

  const linkClicks = [
    { link: 'GitHub', clicks: 156, color: '#24292e' },
    { link: 'LinkedIn', clicks: 134, color: '#0A66C2' },
    { link: 'Portfolio', clicks: 98, color: '#8b5cf6' },
    { link: 'Email', clicks: 67, color: '#ec4899' },
  ];

  const sectionAttention = [
    { section: 'Summary', avgTime: 28, color: '#3b82f6' },
    { section: 'Skills', avgTime: 35, color: '#10b981' },
    { section: 'Experience', avgTime: 52, color: '#8b5cf6' },
    { section: 'Projects', avgTime: 45, color: '#f59e0b' },
    { section: 'Education', avgTime: 18, color: '#ec4899' },
  ];

  const retentionCurve = [
    { time: 0, retention: 100 },
    { time: 10, retention: 92 },
    { time: 20, retention: 78 },
    { time: 30, retention: 65 },
    { time: 40, retention: 52 },
    { time: 60, retention: 38 },
    { time: 90, retention: 25 },
    { time: 120, retention: 18 },
    { time: 180, retention: 12 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
          <p className="text-sm font-bold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card-elevated p-8 fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-xs font-bold text-white">AI</span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Resume Analytics</h1>
              <p className="text-gray-600 mt-1">Deep insights into your resume performance</p>
            </div>
          </div>
          <div className="flex gap-3">
            {['7d', '30d', '90d'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`btn ${
                  timeRange === range
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-item">
        <MetricCard title="Total Views" value="405" change="+24%" icon="👁️" gradient="from-blue-500 to-cyan-500" />
        <MetricCard title="Avg. Time" value="78s" change="+12%" icon="⏱️" gradient="from-green-500 to-emerald-500" />
        <MetricCard title="Click Rate" value="29.8%" change="+5.2%" icon="🎯" gradient="from-purple-500 to-pink-500" />
        <MetricCard title="Engagement" value="65%" change="+8%" icon="🔥" gradient="from-orange-500 to-red-500" />
      </div>

      {/* Traffic Section */}
      <div className="card-elevated p-8 fade-in">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          Traffic & Reach
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer title="Views Over Time">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={viewsOverTime}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 600 }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 600 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="views" stroke="#3b82f6" fill="url(#lineGradient)" />
                <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
                {viewsOverTime.filter(d => d.event).map((d, i) => (
                  <ReferenceLine key={i} x={d.date} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer title="Views by Source">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={viewsBySource}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="source" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 600 }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 600 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="views" radius={[8, 8, 0, 0]}>
                  {viewsBySource.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      {/* Engagement Patterns */}
      <div className="card-elevated p-8 fade-in">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          Engagement Patterns
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer title="Peak Activity Times">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-3 text-gray-700 font-bold">Day</th>
                    {Object.keys(heatmapData[0]).filter(k => k !== 'day').map(hour => (
                      <th key={hour} className="text-center p-3 text-gray-700 font-bold text-xs">{hour}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heatmapData.map((row, i) => (
                    <tr key={i}>
                      <td className="p-3 font-bold text-gray-800">{row.day}</td>
                      {Object.entries(row).filter(([k]) => k !== 'day').map(([hour, val], j) => {
                        const intensity = Math.min(val / 40, 1);
                        return (
                          <td key={j} className="p-2">
                            <div 
                              className="w-full h-12 rounded-lg flex items-center justify-center text-xs font-bold transition-all hover:scale-105 cursor-pointer"
                              style={{ 
                                backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                                color: intensity > 0.5 ? 'white' : '#1f2937'
                              }}
                            >
                              {val}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartContainer>

          <ChartContainer title="Behavior Clusters">
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  type="number" 
                  dataKey="scrollDepth" 
                  name="Scroll Depth" 
                  unit="%" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px', fontWeight: 600 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="timeSpent" 
                  name="Time" 
                  unit="s" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px', fontWeight: 600 }}
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                <Legend />
                <Scatter name="Bounce" data={engagementClusters.filter(d => d.cluster === 'Bounce')} fill="#ef4444" />
                <Scatter name="Stuck" data={engagementClusters.filter(d => d.cluster === 'Stuck')} fill="#f59e0b" />
                <Scatter name="Skimmer" data={engagementClusters.filter(d => d.cluster === 'Skimmer')} fill="#3b82f6" />
                <Scatter name="Engaged" data={engagementClusters.filter(d => d.cluster === 'Engaged')} fill="#10b981" />
              </ScatterChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      {/* Link Engagement */}
      <div className="card-elevated p-8 fade-in">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          Link Engagement
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer title="Click-Through Rate Trend">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={ctrOverTime}>
                <defs>
                  <linearGradient id="ctrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 600 }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 600 }} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="ctr" stroke="#10b981" strokeWidth={3} fill="url(#ctrGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer title="Clicks by Link">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={linkClicks} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 600 }} />
                <YAxis type="category" dataKey="link" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 600 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="clicks" radius={[0, 8, 8, 0]}>
                  {linkClicks.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      {/* Content Performance */}
      <div className="card-elevated p-8 fade-in">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          Content Performance
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer title="Average Time per Section">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={sectionAttention}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="section" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 600 }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 600 }} unit="s" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avgTime" radius={[8, 8, 0, 0]}>
                  {sectionAttention.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer title="Reader Retention Curve">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={retentionCurve}>
                <defs>
                  <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 600 }} unit="s" />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 600 }} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="retention" stroke="#8b5cf6" strokeWidth={3} fill="url(#retentionGradient)" />
                <ReferenceLine y={50} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm font-semibold text-purple-900 flex items-start gap-2">
                <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Insight: At 30s, 65% of readers are still engaged — above industry average!</span>
              </p>
            </div>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, change, icon, gradient }) => {
  const isPositive = change.startsWith('+');

  return (
    <div className="stats-card hover-lift">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center shadow-md`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${
          isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {change}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm text-gray-600 font-semibold uppercase tracking-wide mb-2">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

const ChartContainer = ({ title, children }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
      <h3 className="text-base font-bold text-gray-800 mb-5">{title}</h3>
      {children}
    </div>
  );
};

export default AnalyticsDashboard;