import React, { useState, useEffect } from 'react';

const Filters = ({ services, owners, filters, onSearchChange, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState({
    service: '',
    severity: '',
    status: '',
    owner: '',
    limit: 10
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLocalFilters({
      service: filters.service,
      severity: filters.severity,
      status: filters.status,
      owner: filters.owner,
      limit: filters.limit
    });
    setSearchTerm(filters.search);
  }, [filters]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearchChange(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearchChange]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const nextValue = name === 'limit' ? Number(value) : value;
    const newFilters = {
      ...localFilters,
      [name]: nextValue
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const defaultFilters = {
      service: '',
      severity: '',
      status: '',
      owner: '',
      limit: 10
    };
    setLocalFilters(defaultFilters);
    setSearchTerm('');
    onFilterChange(defaultFilters);
    onSearchChange('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-grow">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by title, service, owner, or summary..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="lg:w-64">
          <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
          <select
            name="service"
            value={localFilters.service}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Services</option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
          <select
            name="severity"
            value={localFilters.severity}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Severities</option>
            <option value="SEV1">SEV1</option>
            <option value="SEV2">SEV2</option>
            <option value="SEV3">SEV3</option>
            <option value="SEV4">SEV4</option>
          </select>
        </div>

        <div className="lg:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={localFilters.status}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="OPEN">OPEN</option>
            <option value="MITIGATED">MITIGATED</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
        </div>

        <div className="lg:w-64">
          <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
          <select
            name="owner"
            value={localFilters.owner}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Assignees</option>
            {owners.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:w-40">
          <label className="block text-sm font-medium text-gray-700 mb-1">Rows / Page</label>
          <select
            name="limit"
            value={localFilters.limit}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="lg:w-auto">
          <label className="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
