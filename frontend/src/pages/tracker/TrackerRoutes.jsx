import { Routes, Route, Navigate } from 'react-router-dom';
import { TrackerAuthProvider, useTrackerAuth } from '../../contexts/TrackerAuthContext';
import TrackerLogin from './TrackerLogin';
import TrackerLayout from './TrackerLayout';
import TrackerDashboard from './TrackerDashboard';
import TrackerTraining from './TrackerTraining';
import TrackerClients from './TrackerClients';
import TrackerProjects from './TrackerProjects';
import TrackerProducts from './TrackerProducts';
import TrackerInternPayments from './TrackerInternPayments';
import TrackerClientPayments from './TrackerClientPayments';
import TrackerRevenueLedger from './TrackerRevenueLedger';
import TrackerAnalytics from './TrackerAnalytics';
import TrackerReports from './TrackerReports';
import TrackerUsers from './TrackerUsers';
import TrackerSettings from './TrackerSettings';
import TrackerProtectedRoute from '../../components/tracker/TrackerProtectedRoute';

// Wrapper to redirect if already logged in
function LoginRoute() {
    const { user, loading } = useTrackerAuth();
    if (!loading && user) {
        return <Navigate to="/tracker/dashboard" replace />;
    }
    return <TrackerLogin />;
}

export default function TrackerRoutes() {
    return (
        <TrackerAuthProvider>
            <Routes>
                <Route index element={<LoginRoute />} />

                <Route element={
                    <TrackerProtectedRoute>
                        <TrackerLayout />
                    </TrackerProtectedRoute>
                }>
                    <Route path="dashboard" element={<TrackerDashboard />} />
                    <Route path="training" element={<TrackerTraining />} />
                    <Route path="clients" element={<TrackerClients />} />
                    <Route path="projects" element={<TrackerProjects />} />
                    <Route path="products" element={<TrackerProducts />} />
                    <Route path="payments/interns" element={<TrackerInternPayments />} />
                    <Route path="payments/clients" element={<TrackerClientPayments />} />
                    <Route path="finance/ledger" element={<TrackerRevenueLedger />} />
                    <Route path="analytics" element={<TrackerAnalytics />} />
                    <Route path="reports" element={<TrackerReports />} />
                    <Route path="users" element={<TrackerUsers />} />
                    <Route path="settings" element={<TrackerSettings />} />
                </Route>
            </Routes>
        </TrackerAuthProvider>
    );
}
