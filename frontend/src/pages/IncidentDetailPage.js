import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { incidentsAPI } from '../services/api';
import Toast from '../components/Toast';

const IncidentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateError, setUpdateError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    const fetchIncident = async () => {
      setLoading(true);
      setError(null);
    try {
      const response = await incidentsAPI.getById(id);
      setIncident(response.data);
      setFormData(response.data);
    } catch (err) {
      const message = err?.response?.data?.error || 'Failed to fetch incident';
      setError(message);
      setToastType('error');
      setToastMessage(message);
      console.error('Error fetching incident:', err);
    } finally {
      setLoading(false);
    }
    };

    fetchIncident();
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateError(null);
    try {
      const updatePayload = {
        title: formData.title,
        service: formData.service,
        severity: formData.severity,
        status: formData.status,
        owner: formData.owner,
        summary: formData.summary
      };
      const response = await incidentsAPI.update(id, updatePayload);
      setIncident(response.data);
      setIsEditing(false);
      setToastType('success');
      setToastMessage('Incident updated successfully.');
    } catch (err) {
      console.error('Error updating incident:', err);
      setUpdateError(err?.response?.data?.error || 'Failed to update incident');
      setToastType('error');
      setToastMessage(err?.response?.data?.error || 'Failed to update incident');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="text-red-600 text-lg font-semibold mb-4">{error}</div>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  if (loading || !incident) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="mt-4 text-gray-600">Loading incident...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-blue-600 hover:text-blue-700 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to List
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{incident.title}</h1>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  incident.severity === 'SEV1' ? 'bg-red-100 text-red-800' :
                  incident.severity === 'SEV2' ? 'bg-orange-100 text-orange-800' :
                  incident.severity === 'SEV3' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {incident.severity}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  incident.status === 'OPEN' ? 'bg-red-100 text-red-800' :
                  incident.status === 'MITIGATED' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {incident.status}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {updateError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
                  {updateError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                <input
                  type="text"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="SEV1">SEV1 - Critical</option>
                  <option value="SEV2">SEV2 - High</option>
                  <option value="SEV3">SEV3 - Medium</option>
                  <option value="SEV4">SEV4 - Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="MITIGATED">MITIGATED</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                <input
                  type="text"
                  name="owner"
                  value={formData.owner || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                <textarea
                  name="summary"
                  value={formData.summary || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Service</div>
                <div className="text-gray-900">{incident.service}</div>
              </div>

              {incident.owner && (
                <div>
                  <div className="text-sm font-medium text-gray-500">Assigned To</div>
                  <div className="text-gray-900">{incident.owner}</div>
                </div>
              )}

              {incident.summary && (
                <div>
                  <div className="text-sm font-medium text-gray-500">Summary</div>
                  <div className="text-gray-900">{incident.summary}</div>
                </div>
              )}

              <div>
                <div className="text-sm font-medium text-gray-500">Time Created</div>
                <div className="text-gray-900">
                  {new Date(incident.createdAt).toLocaleString()}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500">Time Updated</div>
                <div className="text-gray-900">
                  {new Date(incident.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentDetailPage;
