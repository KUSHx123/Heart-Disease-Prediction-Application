import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Bell, Activity, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

const Dashboard = () => {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<{ full_name: string | null } | null>(null);
  const [notifications] = useState([{ id: 1, message: 'New prediction completed', time: '2 mins ago' }]);
  const [loading, setLoading] = useState(true);
  const [newDataReceived, setNewDataReceived] = useState(false);
  const [healthInsights, setHealthInsights] = useState<string | null>(null);
  
  // Reference to store previous prediction count
  const prevPredictionCount = useRef(0);

  useEffect(() => {
    fetchProfile();
    fetchPredictions();

    const channel = supabase
      .channel('realtime:predictions')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'predictions', filter: `user_id=eq.${user?.id}` }, 
        () => {
          fetchPredictions();
          setNewDataReceived(true);
          
          // Auto-hide the indicator after 3 seconds
          setTimeout(() => setNewDataReceived(false), 3000);
        })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Effect to generate health insights when predictions change
  useEffect(() => {
    if (predictions.length > 0) {
      generateHealthInsights();
    }
  }, [predictions]);

  const generateHealthInsights = () => {
    const lastPrediction = predictions[0];
    if (!lastPrediction) return;
    
    let insight = '';
    if (lastPrediction.result.prediction === 1) {
      insight = 'Your latest health data indicates elevated risk factors. Consider consulting a healthcare provider.';
    } else {
      insight = 'Your latest prediction shows favorable results. Maintain your healthy habits!';
    }

    if (predictions.length >= 2) {
      const improvement = predictions.slice(0, 5).filter(p => p.result.prediction === 0).length / 
                          Math.min(predictions.length, 5);
      
      if (improvement >= 0.6) {
        insight += ' Your recent trend shows improvement in cardiovascular health indicators.';
      }
    }
    
    setHealthInsights(insight);
  };

  const fetchProfile = async () => {
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single();
      if (data) setProfileData(data);
    }
  };

  const fetchPredictions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPredictions(data);
      
      // Check if we have new predictions
      if (prevPredictionCount.current < data.length) {
        setNewDataReceived(true);
        setTimeout(() => setNewDataReceived(false), 3000);
      }
      
      prevPredictionCount.current = data.length;
    }
    setLoading(false);
  };

  const userName = profileData?.full_name || user?.user_metadata?.full_name || 'User';
  const total = predictions.length;
  const lastPrediction = predictions[0]?.result?.prediction;
  const riskLabel = lastPrediction === 1 ? 'High Risk' : lastPrediction === 0 ? 'Low Risk' : '-';

  const low = predictions.filter(p => p.result.prediction === 0).length;
  const high = predictions.filter(p => p.result.prediction === 1).length;
  const medium = Math.max(0, total - low - high); // if we ever support medium

  const riskDistribution = [
    { name: 'Low Risk', value: low },
    { name: 'High Risk', value: high },
    { name: 'Medium Risk', value: medium }
  ];

  // Create monthly aggregated data for better trend visualization
  const trendData = predictions
    .map(p => ({
      date: new Date(p.created_at).toLocaleDateString(),
      risk: p.result.prediction
    }))
    .reverse();

  // Calculate risk factors from your data
  const calculateRiskFactors = () => {
    if (predictions.length === 0) return [];
    
    // Calculate average values
    const avgAge = predictions.reduce((sum, p) => sum + p.age, 0) / predictions.length;
    const avgCholesterol = predictions.reduce((sum, p) => sum + p.cholesterol, 0) / predictions.length;
    const avgBP = predictions.reduce((sum, p) => sum + p.resting_blood_pressure, 0) / predictions.length;
    
    // Return risk factors sorted by concern level
    return [
      { 
        name: 'Cholesterol', 
        value: avgCholesterol,
        status: avgCholesterol > 200 ? 'high' : 'normal'
      },
      { 
        name: 'Blood Pressure', 
        value: avgBP,
        status: avgBP > 130 ? 'high' : 'normal'
      },
      { 
        name: 'Age Factor', 
        value: avgAge,
        status: avgAge > 55 ? 'high' : 'normal'
      }
    ].sort((a, b) => (a.status === 'high' && b.status !== 'high') ? -1 : 1);
  };
  
  const riskFactors = calculateRiskFactors();

  return (
    <div>
      {/* Header with real-time indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {userName}!</h2>
            <div className="flex items-center">
              <p className="text-gray-600">Here's an overview of your heart health predictions.</p>
              {newDataReceived && (
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Activity className="w-3 h-3 mr-1" />
                  New data
                </span>
              )}
            </div>
          </div>
          <div className="relative">
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {notifications.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Health Insights Card */}
      {healthInsights && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                {healthInsights}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Predictions</h3>
          <p className="text-3xl font-bold text-blue-600">{total}</p>
          {loading && <p className="text-xs text-gray-500 mt-2">Updating...</p>}
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Last Prediction</h3>
          <p className={`text-3xl font-bold ${lastPrediction === 1 ? 'text-red-600' : 'text-green-600'}`}>{riskLabel}</p>
          {predictions.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              {new Date(predictions[0]?.created_at).toLocaleString()}
            </p>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Risk Score Trend</h3>
          <p className="text-3xl font-bold text-blue-600">{Math.round((high / (total || 1)) * 100)}%</p>
          <p className="text-xs text-gray-500 mt-2">
            Based on {total} prediction{total !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Risk Trend</h3>
          <div className="h-64">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} domain={[0, 1]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="risk" stroke="#3B82F6" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No trend data available yet
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Risk Distribution</h3>
          <div className="h-64">
            {total > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution.filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No prediction data available yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Risk Factors */}
      {riskFactors.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Key Risk Factors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {riskFactors.map((factor, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-700">{factor.name}</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    factor.status === 'high' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {factor.status}
                  </span>
                </div>
                <p className="text-2xl font-bold mt-2">{Math.round(factor.value)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Recent Predictions</h3>
            <Link to="/history" className="text-blue-600 hover:text-blue-700 font-medium">View All</Link>
          </div>
          <div className="overflow-x-auto">
            {loading && predictions.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Loading prediction data...</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cholesterol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Pressure</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {predictions.slice(0, 5).map((p, index) => (
                    <tr key={index} className={index === 0 && newDataReceived ? "bg-blue-50" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(p.created_at).toLocaleDateString()} {new Date(p.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.age}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.cholesterol}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.resting_blood_pressure}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          p.result.prediction === 1 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {p.result.prediction === 1 ? 'High Risk' : 'Low Risk'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && predictions.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Activity className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2">No predictions yet.</p>
                <Link to="/predict" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                  Make Your First Prediction
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;