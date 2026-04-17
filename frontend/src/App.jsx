import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { ImageDetailPage } from './pages/ImageDetailPage.jsx';
import { GalleryPage } from './pages/GalleryPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { UploadPage } from './pages/UploadPage.jsx';
import { UserCenterPage } from './pages/UserCenterPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/gallery" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/gallery"
        element={
          <ProtectedRoute>
            <AppLayout>
              <GalleryPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <AppLayout>
              <UploadPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/images/:imageId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ImageDetailPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-center"
        element={
          <ProtectedRoute>
            <AppLayout>
              <UserCenterPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/gallery" replace />} />
    </Routes>
  );
}
