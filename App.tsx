import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UIProvider } from './contexts/UIContext';
import { DataProvider } from './contexts/DataContext';
import { useAppContext } from './contexts/AppContextAdapter';

import SiteLayout from './components/SiteLayout';
import SistemaLayout from './components/SistemaLayout';
import PrivateRoute from './components/PrivateRoute';

import Home from './views/Home';
import Dashboard from './views/Dashboard';
import ConnectView from './views/ConnectView';
import Blog from './views/Blog';
import Login from './views/Login';
import Register from './views/Register';
import CompleteProfile from './views/CompleteProfile';
import Profile from './views/Profile';
import CourseDetail from './views/CourseDetail';
import LessonView from './views/LessonView';
import CourseEditor from './views/CourseEditor';
import CertificateView from './views/CertificateView';
import ArticleView from './views/ArticleView';
import ArticleEditor from './views/ArticleEditor';
import StudentEditor from './views/StudentEditor';
import CommunityView from './views/CommunityView';
import ForumView from './views/ForumView';
import ForumPostDetailView from './views/ForumPostDetailView';
import ForumPostEditor from './views/ForumPostEditor';
import ProjectDetailView from './views/ProjectDetailView';
import ProjectEditor from './views/ProjectEditor';
import PartnershipsView from './views/PartnershipsView';
import EventEditor from './views/EventEditor';
import PrivacyPolicyView from './views/PrivacyPolicyView';
import TermsOfUseView from './views/TermsOfUseView';
import TeamView from './views/TeamView';
import TeamMemberEditor from './views/TeamMemberEditor';
import ProfileModal from './components/ProfileModal';
import OnboardingTour from './components/OnboardingTour';
import Courses from './views/Courses';
import DonateView from './views/DonateView';
import AboutUsView from './views/AboutUsView';
import ChangePassword from './views/ChangePassword';
import SupportersView from './views/SupportersView';
import MentorDashboard from './views/MentorDashboard';
import TransparencyEditor from './views/TransparencyEditor';
import InscriptionFormModal from './components/InscriptionFormModal';

const AppContent: React.FC = () => {
  const { user, toast, isProfileModalOpen, selectedProfile, isInscriptionModalOpen, selectedCourseForInscription, handleCompleteOnboarding, closeProfileModal, closeInscriptionModal } = useAppContext();

  return (
    <div className="bg-[#09090B] text-white font-sans selection:bg-[#8a4add] selection:text-white overflow-x-hidden">
      <Routes>
        {/* SITE (Institucional) */}
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/article/:articleId" element={<ArticleView />} />
          <Route path="/team" element={<TeamView />} />
          <Route path="/partnerships" element={<PartnershipsView />} />
          <Route path="/supporters" element={<SupportersView />} />
          <Route path="/donate" element={<DonateView />} />
          <Route path="/privacy" element={<PrivacyPolicyView />} />
          <Route path="/terms" element={<TermsOfUseView />} />
          <Route path="/about" element={<AboutUsView />} />
        </Route>

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/connect" element={<ConnectView />} />

        {/* SISTEMA (LMS) - Protegido */}
        <Route element={<PrivateRoute><SistemaLayout /></PrivateRoute>}>
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/course/:courseId" element={<CourseDetail />} />
          <Route path="/course/:courseId/lesson/:lessonId" element={<LessonView />} />
          <Route path="/course/:courseId/certificate" element={<CertificateView />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/course-editor" element={<CourseEditor />} />
          <Route path="/admin/course-editor/:courseId" element={<CourseEditor />} />
          <Route path="/admin/article-editor" element={<ArticleEditor />} />
          <Route path="/admin/article-editor/:articleId" element={<ArticleEditor />} />
          <Route path="/admin/user-editor/new" element={<StudentEditor />} />
          <Route path="/admin/user-editor/:userId" element={<StudentEditor />} />
          <Route path="/admin/transparency-editor" element={<TransparencyEditor />} />
          <Route path="/admin/transparency-editor/:type/:id" element={<TransparencyEditor />} />
          <Route path="/mentor-dashboard" element={<MentorDashboard />} />
          <Route path="/community" element={<CommunityView />} />
          <Route path="/forum" element={<ForumView />} />
          <Route path="/community/post/:postId" element={<ForumPostDetailView />} />
          <Route path="/community/post/new" element={<ForumPostEditor />} />
          <Route path="/project/:projectId" element={<ProjectDetailView />} />
          <Route path="/project/edit" element={<ProjectEditor />} />
          <Route path="/project/edit/:projectId" element={<ProjectEditor />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Modals */}
      {isProfileModalOpen && selectedProfile && <ProfileModal member={selectedProfile} onClose={closeProfileModal} />}
      {isInscriptionModalOpen && <InscriptionFormModal isOpen={isInscriptionModalOpen} onClose={closeInscriptionModal} courseName={selectedCourseForInscription?.title} />}

      {/* Onboarding */}
      {user && !user.hasCompletedOnboardingTour && user.profileStatus === 'complete' && (
        <OnboardingTour onComplete={handleCompleteOnboarding} />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-white text-black px-6 py-3 rounded-lg shadow-2xl z-[100] animate-slide-up flex items-center gap-2 border-l-4 border-[#8a4add]">
          {toast}
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <UIProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </UIProvider>
    </AuthProvider>
  );
};

export default App;
