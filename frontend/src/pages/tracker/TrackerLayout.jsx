import { Outlet } from 'react-router-dom';
import TrackerSidebar from '../../components/tracker/TrackerSidebar';

export default function TrackerLayout() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <TrackerSidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
