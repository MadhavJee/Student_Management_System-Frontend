import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e2230',
              color: '#e8eaed',
              border: '1px solid #2e3347',
              borderRadius: '8px',
              fontSize: '0.875rem',
            },
            success: {
              iconTheme: { primary: '#00b894', secondary: '#1e2230' },
            },
            error: {
              iconTheme: { primary: '#e17055', secondary: '#1e2230' },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
