import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GpaProvider } from './context/GpaContext';
import Layout from './components/layout/Layout';
import SemestersCountPage from './components/pages/SemestersCountPage';
import GPAEntryPage from './components/pages/GPAEntryPage';
import AnalysisPage from './components/pages/AnalysisPage';
import FutureSemestersPage from './components/pages/FutureSemestersPage';
import FutureCoursesPage from './components/pages/FutureCoursesPage';
import DetailedAnalysisPage from './components/pages/DetailedAnalysisPage';

function App() {
  return (
    <BrowserRouter>
      <GpaProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/semesters" replace />} />
            <Route path="/semesters" element={<SemestersCountPage />} />
            <Route path="/gpa-entry" element={<GPAEntryPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/future-semesters" element={<FutureSemestersPage />} />
            <Route path="/future-courses" element={<FutureCoursesPage />} />
            <Route path="/detailed-analysis" element={<DetailedAnalysisPage />} />
          </Routes>
        </Layout>
      </GpaProvider>
    </BrowserRouter>
  );
}

export default App;