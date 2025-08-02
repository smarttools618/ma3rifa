import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import PaymentForm from './pages/PaymentForm'
import UpgradePlan from './pages/UpgradePlan'
import NotFound from './pages/NotFound'
import About from './pages/About'
import Contact from './pages/Contact'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import RefundPolicy from './pages/RefundPolicy'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminSubscriptions from './pages/admin/AdminSubscriptions'
import AdminPayments from './pages/admin/AdminPayments'
import AdminContent from './pages/admin/AdminContent'
import AdminAssistants from './pages/admin/AdminAssistants'
import AdminProfile from './pages/admin/AdminProfile'

// Assistant Pages
import AssistantDashboard from './pages/AssistantDashboard'
import AssistantProfile from './pages/AssistantProfile'

// Components
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import AssistantRoute from './components/AssistantRoute'

// Context
import { AuthProvider } from './context/AuthContext'

// Import Supabase client
import { supabase } from './services/supabaseClient'

function App() {
  return (
    <AuthProvider supabase={supabase}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Routes - User */}
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/payment-form" element={
          <ProtectedRoute>
            <PaymentForm />
          </ProtectedRoute>
        } />
        <Route path="/upgrade-plan" element={
          <ProtectedRoute>
            <UpgradePlan />
          </ProtectedRoute>
        } />
        
        {/* Protected Routes - Admin */}
        <Route path="/admin/*" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        } />
        <Route path="/admin/subscriptions" element={
          <AdminRoute>
            <AdminSubscriptions />
          </AdminRoute>
        } />
        <Route path="/admin/payments" element={
          <AdminRoute>
            <AdminPayments />
          </AdminRoute>
        } />
        <Route path="/admin/content" element={
          <AdminRoute>
            <AdminContent />
          </AdminRoute>
        } />
        <Route path="/admin/assistants" element={
          <AdminRoute>
            <AdminAssistants />
          </AdminRoute>
        } />
        <Route path="/admin/profile" element={
          <AdminRoute>
            <AdminProfile />
          </AdminRoute>
        } />
        
        {/* Protected Routes - Assistant */}
        <Route path="/assistant/*" element={
          <AssistantRoute>
            <AssistantDashboard />
          </AssistantRoute>
        } />
        <Route path="/assistant/profile" element={
          <AssistantRoute>
            <AssistantProfile />
          </AssistantRoute>
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App