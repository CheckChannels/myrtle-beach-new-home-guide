import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './components/ui/Toast';
import { HomePage } from './pages/HomePage';
import { BuildersPage } from './pages/BuildersPage';
import { BuilderDetailPage } from './pages/BuilderDetailPage';
import { CommunitiesPage } from './pages/CommunitiesPage';
import { CommunityDetailPage } from './pages/CommunityDetailPage';
import { AreasPage } from './pages/AreasPage';
import { AreaDetailPage } from './pages/AreaDetailPage';
import { FutureSubdivisionsPage } from './pages/FutureSubdivisionsPage';
import { RecentlyCompletedPage } from './pages/RecentlyCompletedPage';
import { ComparePage } from './pages/ComparePage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';

function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-primary mb-4">Page Not Found</h1>
      <p className="text-muted mb-6">The page you're looking for doesn't exist.</p>
      <a href="/" className="btn-primary inline-flex">Return Home</a>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/builders" element={<BuildersPage />} />
            <Route path="/builders/:builderSlug" element={<BuilderDetailPage />} />
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/communities/:communitySlug" element={<CommunityDetailPage />} />
            <Route path="/areas" element={<AreasPage />} />
            <Route path="/areas/:areaSlug" element={<AreaDetailPage />} />
            <Route path="/future-subdivisions" element={<FutureSubdivisionsPage />} />
            <Route path="/recently-completed" element={<RecentlyCompletedPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AppProvider>
    </ToastProvider>
  );
}
