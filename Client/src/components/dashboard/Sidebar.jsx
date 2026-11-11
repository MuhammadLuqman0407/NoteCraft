import { Link } from 'react-router-dom';
import {
    FileText,
    CheckCircle,
    Star,
    Tag,
    Archive,
    Trash2,
    Plus,
    BookOpen,
    Lock,
    Settings,
    Layers,
    Sun,
    Moon,
} from 'lucide-react';
import { useNotes } from '../../context/NotesContext';
import { useTheme } from '../../context/ThemeContext';

export default function Sidebar() {
    const { notes, activeFilter, setActiveFilter, createNewNote } = useNotes();
    const { theme, toggleTheme } = useTheme();

    const countTag = (tag) => notes.filter((n) => n.tag === tag).length;

    const mainNavItems = [
        { label: 'Notes', icon: FileText, filter: 'All', count: notes.length },
        { label: 'Tasks', icon: CheckCircle, filter: 'Tasks' },
        { label: 'Favorites', icon: Star, filter: 'Favorites' },
        { label: 'Tags', icon: Tag, filter: 'Tags' },
        { label: 'Archive', icon: Archive, filter: 'Archive' },
        { label: 'Trash', icon: Trash2, filter: 'Trash' },
    ];

    const tagsList = [
        { name: 'Work', color: '#ea580c', count: countTag('Work') },
        { name: 'Study', color: '#3b82f6', count: countTag('Study') },
        { name: 'Personal', color: '#ec4899', count: countTag('Personal') },
        { name: 'Ideas', color: '#10b981', count: countTag('Ideas') },
    ];

    return (
        <aside className="w-64 h-full flex flex-col justify-between border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] p-4 select-none shrink-0 transition-colors duration-200">
            <div className="space-y-6">
                {/* macOS Window dots + Noted Brand */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--dot-red)' }} />
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--dot-yellow)' }} />
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--dot-green)' }} />
                        </div>

                        <button
                            onClick={toggleTheme}
                            className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            title="Toggle theme"
                        >
                            {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                        </button>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <div className="w-6 h-6 rounded-md bg-[var(--card-active-bg)] text-[var(--text-accent)] flex items-center justify-center">
                            <Layers className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-base font-bold tracking-tight text-[var(--text-primary)]">
                            Noted<span className="text-[var(--text-accent)]">.</span>
                        </span>
                    </div>
                </div>

                {/* Primary Navigation */}
                <nav className="space-y-1">
                    {mainNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeFilter === item.filter;
                        return (
                            <button
                                key={item.label}
                                onClick={() => setActiveFilter(item.filter)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${isActive
                                        ? 'bg-[var(--card-active-bg)] text-[var(--text-accent)] shadow-sm'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--notelist-bg)] hover:text-[var(--text-primary)]'
                                    }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Icon className="w-4 h-4 opacity-80" />
                                    <span>{item.label}</span>
                                </div>
                                {item.count !== undefined && <span className="text-[11px] opacity-70">{item.count}</span>}
                            </button>
                        );
                    })}
                </nav>

                {/* Tags Section */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between px-2 text-[10px] font-bold tracking-wider text-[var(--text-muted)] uppercase">
                        <span>Tags</span>
                        <button onClick={createNewNote} className="hover:text-[var(--text-primary)]">
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="space-y-0.5">
                        {tagsList.map((tag) => (
                            <button
                                key={tag.name}
                                onClick={() => setActiveFilter(tag.name)}
                                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeFilter === tag.name
                                        ? 'bg-[var(--card-active-bg)] text-[var(--text-primary)] font-semibold'
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--notelist-bg)]'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />
                                    <span>{tag.name}</span>
                                </div>
                                <span className="text-[11px] text-[var(--text-muted)]">{tag.count}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notebooks Section */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between px-2 text-[10px] font-bold tracking-wider text-[var(--text-muted)] uppercase">
                        <span>Notebooks</span>
                        <button className="hover:text-[var(--text-primary)]">
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="space-y-0.5">
                        <button className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-[var(--text-secondary)] hover:bg-[var(--notelist-bg)] transition-colors">
                            <BookOpen className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                            <span>Daily Journal</span>
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-[var(--text-secondary)] hover:bg-[var(--notelist-bg)] transition-colors">
                            <BookOpen className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                            <span>Product Roadmap</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* User Footer */}
            <div className="pt-4 border-t border-[var(--sidebar-border)] space-y-2">
                <button className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Private Vault</span>
                </button>

                <div className="flex items-center justify-between px-2 pt-1">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[var(--text-accent)] text-white font-bold text-xs flex items-center justify-center">
                            ER
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-bold text-[var(--text-primary)] leading-none">Elena Rostova</p>
                            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Pro Member</p>
                        </div>
                    </div>
                    <Link to="/login" title="Account settings">
                        <Settings className="w-4 h-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" />
                    </Link>
                </div>
            </div>
        </aside>
    );
}