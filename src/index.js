import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import LicenseChart from './LicenseChart';

const data = require('./data.json')
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <LicenseChart data={data} title="Licenses" />
  </React.StrictMode>
);
