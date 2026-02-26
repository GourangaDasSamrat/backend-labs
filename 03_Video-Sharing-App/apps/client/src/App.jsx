import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import MainLayout from './components/layout/MainLayout'
import ProtectedRoute from './components/common/ProtectedRoute'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VideoPage from './pages/VideoPage'
import ChannelPage from './pages/ChannelPage'
import SearchPage from './pages/SearchPage'
import DashboardPage from './pages/DashboardPage'
import UploadPage from './pages/UploadPage'
import LikedVideosPage from './pages/LikedVideosPage'
import WatchHistoryPage from './pages/WatchHistoryPage'
import SettingsPage from './pages/SettingsPage'
import PlaylistsPage from './pages/PlaylistsPage'
import CommunityPage from './pages/CommunityPage'
import SubscriptionsPage from './pages/SubscriptionsPage'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1f1735',
                color: '#e2e8f0',
                borderRadius: '12px',
                border: '1px solid #4c1d95',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#7c3aed', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
          <Routes>
            {/* Public auth routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Main layout routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/video/:videoId" element={<VideoPage />} />
              <Route path="/channel/:userName" element={<ChannelPage />} />

              {/* Protected routes */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
              <Route path="/liked-videos" element={<ProtectedRoute><LikedVideosPage /></ProtectedRoute>} />
              <Route path="/watch-history" element={<ProtectedRoute><WatchHistoryPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/playlists" element={<ProtectedRoute><PlaylistsPage /></ProtectedRoute>} />
              <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
              <Route path="/subscriptions" element={<ProtectedRoute><SubscriptionsPage /></ProtectedRoute>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
