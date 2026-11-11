import { Search, ChevronDown, ListFilter, Pin, Plus } from 'lucide-react';
import { useNotes } from '../../context/NotesContext';

export default function NoteListColumn() {
    const { notes, activeNoteId, setActiveNoteId, activeFilter, setActiveFilter, searchQuery, setSearchQuery, createNewNote } = useNotes();

    const filteredNotes = notes.filter((note) => {
        const matchesFilter =
            activeFilter === 'All' || activeFilter === 'Notes' ? true : note.tag === activeFilter;
        const matchesSearch =
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.preview.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="w-80 h-full flex flex-col border-r border-[var(--notelist-border)] bg-[var(--notelist-bg)] select-none shrink-0 transition-colors duration-200">
            {/* Top Search Bar */}
            <div className="p-3 border-b border-[var(--notelist-border)]">
                <div className="relative flex items-center">
                    <Search className="w-3.5 h-3.5 absolute left-3 text-[var(--text-muted)] pointer-events-none" />
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search notes, tags..."
                        className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl pl-8 pr-12 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--text-accent)] transition-all"
                    />
                    <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[9px] font-semibold text-[var(--text-muted)] bg-[var(--notelist-bg)] border border-[var(--notelist-border)] rounded">
                        ⌘K
                    </kbd>
                </div>
            </div>

            {/* Header and Filter Pills */}
            <div className="px-4 py-3 space-y-2 border-b border-[var(--notelist-border)]">
                <div className="flex items-center justify-between">
                    <button className="flex items-center gap-1 text-sm font-bold text-[var(--text-primary)]">
                        <span>All Notes</span>
                        <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    </button>
                    <div className="flex items-center gap-2">
                        <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                            <ListFilter className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={createNewNote}
                            className="p-1 rounded-md bg-[var(--btn-primary-bg)] text-white hover:opacity-90"
                            title="Create note"
                        >
                            <Plus className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 text-[11px] font-medium overflow-x-auto pb-0.5">
                    <button
                        onClick={() => setActiveFilter('All')}
                        className={`px-2 py-0.5 rounded-full ${activeFilter === 'All'
                            ? 'bg-[var(--card-active-bg)] text-[var(--text-accent)] font-bold'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                            }`}
                    >
                        {notes.length} active
                    </button>
                    <button
                        onClick={() => setActiveFilter('Work')}
                        className={`px-2 py-0.5 rounded-full ${activeFilter === 'Work'
                            ? 'bg-[var(--card-active-bg)] text-[var(--text-accent)] font-bold'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                            }`}
                    >
                        Pinned
                    </button>
                    <button
                        onClick={() => setActiveFilter('Work')}
                        className="px-2 py-0.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                        Work
                    </button>
                </div>
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {filteredNotes.map((note) => {
                    const isActive = note.id === activeNoteId;
                    return (
                        <div
                            key={note.id}
                            onClick={() => setActiveNoteId(note.id)}
                            className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-150 ${isActive
                                ? 'bg-[var(--card-active-bg)] border-[var(--card-active-border)] shadow-sm'
                                : 'bg-[var(--card-bg)] border-[var(--card-border)] hover:border-[var(--text-accent)]/40'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: note.tagColor }} />
                                    <h3 className="text-xs font-bold text-[var(--text-primary)] tracking-tight">
                                        {note.title}
                                    </h3>
                                </div>
                                {note.pinned && <Pin className="w-3 h-3 text-[var(--text-accent)] fill-current" />}
                            </div>

                            <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                                {note.preview}
                            </p>

                            <div className="flex items-center justify-between pt-2.5 text-[10px]">
                                <span className="px-2 py-0.5 rounded-md bg-[var(--notelist-bg)] text-[var(--text-secondary)] font-medium">
                                    {note.tag}
                                </span>
                                <span className="text-[var(--text-muted)]">{note.timestamp}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Column Footer */}
            <div className="px-4 py-2 border-t border-[var(--notelist-border)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                <span>{filteredNotes.length} documents</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Synced
                </span>
            </div>
        </div>
    );
}