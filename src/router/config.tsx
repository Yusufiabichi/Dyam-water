import React, { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/admin/ProtectedRoute';

// Public Pages
const HomePage = lazy(() => import('../pages/home/page'));
const AboutPage = lazy(() => import('../pages/about/page'));
const ProductsPage = lazy(() => import('../pages/products/page'));
const DistributionPage = lazy(() => import('../pages/distribution/page'));
const CharityPage = lazy(() => import('../pages/charity/page'));
const ContactPage = lazy(() => import('../pages/contact/page'));
const PaymentSuccessPage = lazy(() => import('../pages/payment-success/page'));

// Admin Pages
const AdminLoginPage = lazy(() => import('../pages/admin/login/page'));
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const AdminDashboardPage = lazy(() => import('../pages/admin/dashboard/page'));
const AdminDistributorsPage = lazy(() => import('../pages/admin/distributors/page'));
const AdminCharityPlansPage = lazy(() => import('../pages/admin/charity-plans/page'));
const AdminSponsorsPage = lazy(() => import('../pages/admin/sponsors/page'));
const AdminTransactionsPage = lazy(() => import('../pages/admin/transactions/page'));
const AdminMessagesPage = lazy(() => import('../pages/admin/messages/page'));

// Loading component for Suspense
const PageLoader = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-ocean-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  </div>
);

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/payment-success',
    element: <PaymentSuccessPage />,
  },
  {
    path: '/about-us',
    element: <AboutPage />,
  },
  {
    path: '/products',
    element: <ProductsPage />,
  },
  {
    path: '/distribution-network',
    element: <DistributionPage />,
  },
  {
    path: '/charity-water',
    element: <CharityPage />,
  },
  {
    path: '/contact',
    element: <ContactPage />,
  },
  // Admin Routes
  {
    path: '/admin/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AdminLoginPage />
      </Suspense>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<PageLoader />}>
          <AdminLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminDashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'distributors',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminDistributorsPage />
          </Suspense>
        ),
      },
      {
        path: 'charity-plans',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminCharityPlansPage />
          </Suspense>
        ),
      },
      {
        path: 'sponsors',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminSponsorsPage />
          </Suspense>
        ),
      },
      {
        path: 'transactions',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminTransactionsPage />
          </Suspense>
        ),
      },
      {
        path: 'messages',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminMessagesPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
