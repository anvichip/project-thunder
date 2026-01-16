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
    { source: 'Indeed', views: 98, color: '#2164F3' },
    { source: 'Company Site', views: 76, color: '#7C3AED' },
    { source: 'Direct Link', views: 54, color: '#EC4899' },
    { source: 'Other', views: 32, color: '#6B7280' },
  ];

  const heatmapData = [
    { day: 'Mon', '9AM': 8, '10AM': 15, '11AM': 22, '12PM': 18, '2PM': 25, '3PM': 30, '4PM': 20, '5PM': 12 },
    { day: 'Tue', '9AM': 12, '10AM': 20, '11AM': 28, '12PM': 22, '2PM': 32, '3PM': 35, '4PM': 25, '5PM': 15 },
    { day: 'Wed', '9AM': 10, '10AM': 18, '11AM': 25, '12PM': 20, '2PM': 28, '3PM': 32, '4PM': 22, '5PM': 14 },
    { day: 'Thu', '9AM': 14, '10AM': 22, '11AM': 30, '12PM': 25, '2PM': 35, '3PM': 38, '4PM': 28, '5PM': 18 },
    { day: 'Fri', '9AM': 16, '10AM': 24, '11AM': 20, '12PM': 15, '2PM': 22, '3PM': 18, '4PM': 12, '5PM': 8 },
  ];

  const engagementClusters = [
    // Bounced
    { scrollDepth: 15, timeSpent: 8, cluster: 'Bounce', color: '#EF4444' },
    { scrollDepth: 20, timeSpent: 12, cluster: 'Bounce', color: '#EF4444' },
    { scrollDepth: 10, timeSpent: 5, cluster: 'Bounce', color: '#EF4444' },
    // Stuck at top
    { scrollDepth: 25, timeSpent: 45, cluster: 'Stuck', color: '#F59E0B' },
    { scrollDepth: 30, timeSpent: 52, cluster: 'Stuck', color: '#F59E0B' },
    { scrollDepth: 28, timeSpent: 48, cluster: 'Stuck', color: '#F59E0B' },
    // Fast skimmer
    { scrollDepth: 85, timeSpent: 25, cluster: 'Skimmer', color: '#3B82F6' },
    { scrollDepth: 90, timeSpent: 30, cluster: 'Skimmer', color: '#3B82F6' },
    { scrollDepth: 95, timeSpent: 28, cluster: 'Skimmer', color: '#3B82F6' },
    // Deeply engaged
    { scrollDepth: 95, timeSpent: 120, cluster: 'Engaged', color: '#10B981' },
    { scrollDepth: 100, timeSpent: 145, cluster: 'Engaged', color: '#10B981' },
    { scrollDepth: 98, timeSpent: 135, cluster: 'Engaged', color: '#10B981' },
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
    { link: 'GitHub', clicks: 156, color: '#24292E' },
    { link: 'LinkedIn', clicks: 134, color: '#0A66C2' },
    { link: 'Portfolio', clicks: 98, color: '#7C3AED' },
    { link: 'Email', clicks: 67, color: '#EC4899' },
  ];

  const sectionAttention = [
    { section: 'Summary', avgTime: 28, color: '#3B82F6' },
    { section: 'Skills', avgTime: 35, color: '#10B981' },
    { section: 'Experience', avgTime: 52, color: '#7C3AED' },
    { section: 'Projects', avgTime: 45, color: '#F59E0B' },
    { section: 'Education', avgTime: 18, color: '#EC4899' },
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
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">📊</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Resume Analytics</h1>
                <p className="text-gray-600 mt-1">Track performance and engagement insights</p>
              </div>
            </div>
            <div className="flex gap-2">
              {['7d', '30d', '90d'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    timeRange === range
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <MetricCard title="Total Views" value="405" change="+24%" icon="👁️" color="blue" />
          <MetricCard title="Avg. Time" value="78s" change="+12%" icon="⏱️" color="green" />
          <MetricCard title="Click Rate" value="29.8%" change="+5.2%" icon="🎯" color="purple" />
          <MetricCard title="Engagement" value="65%" change="+8%" icon="🔥" color="orange" />
        </div>

        {/* Traffic Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>📈</span> Traffic & Reach
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Views Over Time */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Views Over Time</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={viewsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', r: 5 }} />
                  {viewsOverTime.filter(d => d.event).map((d, i) => (
                    <ReferenceLine key={i} x={d.date} stroke="#EF4444" strokeDasharray="3 3" label={{ value: d.event, position: 'top', fill: '#EF4444', fontSize: 10 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Views by Source */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Views by Source</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={viewsBySource}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="source" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="views" radius={[8, 8, 0, 0]}>
                    {viewsBySource.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Engagement Patterns */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>🔍</span> Engagement Patterns
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Peak Activity Heatmap */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Peak Activity Times</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2 text-gray-600">Day</th>
                      {Object.keys(heatmapData[0]).filter(k => k !== 'day').map(hour => (
                        <th key={hour} className="text-center p-2 text-gray-600">{hour}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {heatmapData.map((row, i) => (
                      <tr key={i}>
                        <td className="p-2 font-medium text-gray-700">{row.day}</td>
                        {Object.entries(row).filter(([k]) => k !== 'day').map(([hour, val], j) => {
                          const intensity = Math.min(val / 40, 1);
                          return (
                            <td key={j} className="p-2">
                              <div 
                                className="w-full h-8 rounded flex items-center justify-center text-xs font-semibold"
                                style={{ 
                                  backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                                  color: intensity > 0.5 ? 'white' : '#1F2937'
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
            </div>

            {/* Behavior Clusters */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Behavior Clusters</h3>
              <ResponsiveContainer width="100%" height={250}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    type="number" 
                    dataKey="scrollDepth" 
                    name="Scroll Depth" 
                    unit="%" 
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="timeSpent" 
                    name="Time" 
                    unit="s" 
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                  <Legend />
                  <Scatter name="Bounce" data={engagementClusters.filter(d => d.cluster === 'Bounce')} fill="#EF4444" />
                  <Scatter name="Stuck" data={engagementClusters.filter(d => d.cluster === 'Stuck')} fill="#F59E0B" />
                  <Scatter name="Skimmer" data={engagementClusters.filter(d => d.cluster === 'Skimmer')} fill="#3B82F6" />
                  <Scatter name="Engaged" data={engagementClusters.filter(d => d.cluster === 'Engaged')} fill="#10B981" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Click Analysis */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>🔗</span> Link Engagement
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CTR Trend */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Click-Through Rate Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={ctrOverTime}>
                  <defs>
                    <linearGradient id="ctrGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="ctr" stroke="#10B981" strokeWidth={2} fill="url(#ctrGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Link Distribution */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Clicks by Link</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={linkClicks} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis type="category" dataKey="link" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="clicks" radius={[0, 8, 8, 0]}>
                    {linkClicks.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Content Performance */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>📄</span> Content Performance
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Section Attention */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Average Time per Section</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={sectionAttention}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="section" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} unit="s" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="avgTime" radius={[8, 8, 0, 0]}>
                    {sectionAttention.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Retention Curve */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Reader Retention Curve</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={retentionCurve}>
                  <defs>
                    <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="time" stroke="#6B7280" style={{ fontSize: '12px' }} unit="s" />
                  <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="retention" stroke="#7C3AED" strokeWidth={3} fill="url(#retentionGradient)" />
                  <ReferenceLine y={50} stroke="#EF4444" strokeDasharray="3 3" label={{ value: '50% threshold', fill: '#EF4444', fontSize: 12 }} />
                </AreaChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-2">At 30s, 65% of readers are still engaged</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, change, icon, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-md`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
          {change}
        </span>
      </div>
      <h3 className="text-sm text-gray-600 font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
};

export default AnalyticsDashboard;