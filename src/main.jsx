import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store.js';
import { ThemeProvider } from './theme/ThemeContext.jsx';
import { LanguageProvider } from './language/LanguageContext.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';
import { AdminAuthProvider } from './admin/useAdminAuth.jsx';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <AdminAuthProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </AdminAuthProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);