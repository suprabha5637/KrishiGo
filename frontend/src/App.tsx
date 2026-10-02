import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { LanguageProvider } from './context/LanguageContext';
import { WeatherProvider } from './context/WeatherContext';

// KrishiGo E-Commerce Customer Pages
import { HomePage } from './pages/krishigo/HomePage';
import { CategoryPage } from './pages/krishigo/CategoryPage';
import { OrdersPage } from './pages/krishigo/OrdersPage';

// Farmer Agricultural Intelligence Command Center Pages
import { FarmerHomePage } from './pages/farmer/FarmerHomePage';
import { WeatherPage } from './pages/farmer/WeatherPage';
import { CropPlannerPage } from './pages/farmer/CropPlannerPage';
import { CropHealthPage } from './pages/farmer/CropHealthPage';
import { SoilFieldPage } from './pages/farmer/SoilFieldPage';
import { IrrigationPage } from './pages/farmer/IrrigationPage';
import { FarmManagementPage } from './pages/farmer/FarmManagementPage';
import { MarketProfitPage } from './pages/farmer/MarketProfitPage';
import { FarmMonitoringPage } from './pages/farmer/FarmMonitoringPage';
import { FarmServicesPage } from './pages/farmer/FarmServicesPage';
import { AICopilotPage } from './pages/farmer/AICopilotPage';
import { SettingsPage } from './pages/farmer/SettingsPage';
import { LocationPickerModal } from './components/common/LocationPickerModal';

// Global Theme Manager to ensure Dark Mode applies everywhere immediately
const ThemeManager = () => {
  React.useEffect(() => {
    const applyTheme = () => {
      const theme = localStorage.getItem('farmerTheme') || 'Light';
      const isDark = theme === 'Dark' || (theme === 'Auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      let styleEl = document.getElementById('global-dark-mode-style');
      if (isDark) {
        if (!styleEl) {
          styleEl = document.createElement('style');
          styleEl.id = 'global-dark-mode-style';
          document.head.appendChild(styleEl);
        }
        styleEl.innerHTML = `
          html {
            filter: invert(1) hue-rotate(180deg) !important;
            background-color: #111 !important;
          }
          html img,
          html video,
          html iframe,
          html [style*="background-image"] {
            filter: invert(1) hue-rotate(180deg) !important;
          }
          html .bg-\\[\\#008037\\],
          html .text-\\[\\#008037\\] {
            filter: invert(1) hue-rotate(180deg) !important;
          }
        `;
        document.documentElement.classList.add('dark');
      } else {
        if (styleEl) {
          styleEl.remove();
        }
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();

    // Listen for custom theme change events
    window.addEventListener('theme-changed', applyTheme);
    return () => window.removeEventListener('theme-changed', applyTheme);
  }, []);

  return null;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <LocationProvider>
            <WeatherProvider>
              <Routes>
              {/* KrishiGo E-Commerce Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/orders" element={<OrdersPage />} />

              {/* Farmer Platform Routes */}
              <Route path="/farmer" element={<FarmerHomePage />} />
              <Route path="/farmer/weather" element={<WeatherPage />} />
              <Route path="/farmer/crop-planner" element={<CropPlannerPage />} />
              <Route path="/farmer/crop-health" element={<CropHealthPage />} />
              <Route path="/farmer/soil-field" element={<SoilFieldPage />} />
              <Route path="/farmer/irrigation" element={<IrrigationPage />} />
              <Route path="/farmer/farm-management" element={<FarmManagementPage />} />
              <Route path="/farmer/market-profit" element={<MarketProfitPage />} />
              <Route path="/farmer/monitoring" element={<FarmMonitoringPage />} />
              <Route path="/farmer/farm-monitoring" element={<FarmMonitoringPage />} />
              <Route path="/farmer/services" element={<FarmServicesPage />} />
              <Route path="/farmer/ai" element={<AICopilotPage />} />
              <Route path="/farmer/settings" element={<SettingsPage />} />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Global Google Map & Live Location Center Modal */}
            <LocationPickerModal />

            {/* Global Theme Manager */}
            <ThemeManager />
            </WeatherProvider>
          </LocationProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
