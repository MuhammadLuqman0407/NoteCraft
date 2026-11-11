import Sidebar from '../components/dashboard/Sidebar';
import NoteListColumn from '../components/dashboard/NoteListColumn';
import NoteEditor from '../components/dashboard/NoteEditor';
import { NotesProvider } from '../context/NotesContext';

export default function Dashboard() {
    return (
        <NotesProvider>
            <div className="h-screen w-screen overflow-hidden flex bg-[var(--theme-bg)] transition-colors duration-200">
                {/* Left Column: Navigation Sidebar */}
                <Sidebar />

                {/* Center Column: Filterable Notes List */}
                <NoteListColumn />

                {/* Right Column: Active Document Editor */}
                <NoteEditor />
            </div>
        </NotesProvider>
    );
}