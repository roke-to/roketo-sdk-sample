import React from 'react';
import ReactDOM from 'react-dom/client';

import { Buffer } from 'buffer';

import './index.css';

import AppLoader from './AppLoader';

global.Buffer = Buffer;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AppLoader />
  </React.StrictMode>
);
