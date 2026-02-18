import React, { useState, useEffect, useCallback } from 'react';
import { incidentsAPI, servicesAPI, ownersAPI } from '../services/api';
import IncidentTable from '../components/IncidentTable';
import Filters from '../components/Filters';
import Pagination from '../components/Pagination';
import { Link, useLocation } from 'react-router-dom';
import Toast from '../components/Toast';

const IncidentListPage = () => {
  const location = useLocation();
  const [incidents, setIncidents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [services, setServices] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    service: '',
    severity: '',
    status: '',
    owner: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const fetchIncidents = useCallback(
    async (signal) => {
      setLoading(true);
      setError(null);
      try {
        const config = signal ? { signal } : undefined;
        const response = await incidentsAPI.getAll(filters, config);
        const responsePagination = response.data.pagination;

        if (responsePagination.totalPages > 0 && filters.page > responsePagination.totalPages) {
          setFilters(prev => ({
            ...prev,
            page: responsePagination.totalPages
          }));
          return;
        }

        setIncidents(response.data.incidents);
        setPagination(responsePagination);
      } catch (err) {
        if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') {
          return;
        }
        const message = err?.response?.data?.error || 'Failed to fetch incidents';
        setError(message);
        setToastType('error');
        setToastMessage(message);
        console.error('Error fetching incidents:', err);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const fetchOwners = async () => {
    try {
      const response = await ownersAPI.getAll();
      setOwners(response.data);
    } catch (err) {
      console.error('Error fetching owners:', err);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchOwners();
  }, []);

  useEffect(() => {
    if (location.state?.created) {
      setToastType('success');
      setToastMessage('Incident created successfully.');
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  useEffect(() => {
    const controller = new AbortController();
    fetchIncidents(controller.signal);
    return () => controller.abort();
  }, [fetchIncidents]);

  const handleSearchChange = useCallback((search) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSortChange = (sortBy, sortOrder) => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder, page: 1 }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      try {
        await incidentsAPI.delete(id);
        setToastType('success');
        setToastMessage('Incident deleted successfully.');
        await fetchIncidents();
      } catch (err) {
        console.error('Error deleting incident:', err);
        const message = err?.response?.data?.error || 'Failed to delete incident';
        setToastType('error');
        setToastMessage(message);
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="text-red-600 text-lg font-semibold mb-4">{error}</div>
          <button
            onClick={() => fetchIncidents()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Retry
          </button>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Incident Tracker</h1>
            <Link
              to="/create"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Incident
            </Link>
          </div>
          <p className="text-gray-600">Manage and track production incidents</p>
        </div>


        <Filters
          services={services}
          owners={owners}
          filters={filters}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
        />

        <IncidentTable
          incidents={incidents}
          loading={loading}
          onSortChange={handleSortChange}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onDelete={handleDelete}
        />

        {pagination.totalPages > 1 && (
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default IncidentListPage;
