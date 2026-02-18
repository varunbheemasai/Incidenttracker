import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IncidentListPage from './pages/IncidentListPage';
import IncidentDetailPage from './pages/IncidentDetailPage';
import CreateIncidentPage from './pages/CreateIncidentPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<IncidentListPage />} />
          <Route path="/incidents/:id" element={<IncidentDetailPage />} />
          <Route path="/create" element={<CreateIncidentPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;