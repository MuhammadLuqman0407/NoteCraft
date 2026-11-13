import { useState } from 'react';
import {
    Pin,
    Star,
    Share2,
    MoreHorizontal,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    List,
    ListOrdered,
    CheckSquare,
    Link2,
    Image,
    Code,
    Undo2,
    Redo2,
    Plus,
} from 'lucide-react';
import { useNotes } from '../../context/NotesContext';

export default function NoteEditor() {
    const { activeNote, updateActiveNote, createNewNote } = useNotes();

    const [title, setTitle] = useState(activeNote?.title || 'Project Planning');

    if (!activeNote) return null;

    const goals = activeNote.content?.goals || [];
    const timeline = activeNote.content?.timeline || [];
    const notesList = activeNote.content?.notes || [];

    const completedGoalsCount = goals.filter((g) => g.completed).length;
    const progressPercent = goals.length > 0 ? Math.round((completedGoalsCount / goals.length) * 100) : 0;

    const toggleGoal = (goalId) => {
        updateActiveNote((prev) => ({
            ...prev,
            content: {
                ...prev.content,
                goals: prev.content.goals.map((g) => (g.id === goalId ? { ...g, completed: !g.completed } : g)),
            },
        }));
    };

    return (
        <main className="flex-1 h-full flex flex-col bg-[var(--editor-bg)] overflow-hidden transition-colors duration-200">
            {/* Top Editor Bar */}
            <header className="px-8 py-3.5 border-b border-[var(--editor-border)] flex items-center justify-between select-none">
                {/* Breadcrumb & Auto-save pill */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--card-active-bg)] text-[11px] font-semibold text-[var(--text-accent)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-accent)]" />
                        <span>{activeNote.tag} / {activeNote.sprint || 'Draft'}</span>
                    </div>
                    <span className="text-[11px] text-[var(--text-muted)]">{activeNote.lastSaved}</span>
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={createNewNote}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--btn-primary-bg)] hover:opacity-90 text-white font-semibold text-xs shadow-sm transition-all"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Note</span>
                    </button>

                    <div className="h-4 w-px bg-[var(--editor-border)] mx-1" />

                    <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg">
                        <Pin className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg">
                        <Star className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg">
                        <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Formatting Toolbar */}
            <div className="px-8 py-2 border-b border-[var(--editor-border)] flex items-center gap-1 text-[var(--text-secondary)] select-none">
                <select className="bg-transparent text-xs font-bold text-[var(--text-primary)] outline-none mr-2 cursor-pointer">
                    <option>H1</option>
                    <option>H2</option>
                    <option>H3</option>
                    <option>Normal</option>
                </select>
                <div className="h-4 w-px bg-[var(--editor-border)] mx-1" />

                <button className="p-1.5 hover:bg-[var(--sidebar-bg)] rounded"><Bold className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 hover:bg-[var(--sidebar-bg)] rounded"><Italic className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 hover:bg-[var(--sidebar-bg)] rounded"><Underline className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 hover:bg-[var(--sidebar-bg)] rounded"><Strikethrough className="w-3.5 h-3.5" /></button>
                <div className="h-4 w-px bg-[var(--editor-border)] mx-1" />

                <button className="p-1.5 hover:bg-[var(--sidebar-bg)] rounded"><List className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 hover:bg-[var(--sidebar-bg)] rounded"><ListOrdered className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 hover:bg-[var(--sidebar-bg)] rounded text-[var(--text-accent)]"><CheckSquare className="w-3.5 h-3.5" /></button>
                <div className="h-4 w-px bg-[var(--editor-border)] mx-1" />

                <button className="p-1.5 hover:bg-[var(--sidebar-bg)] rounded"><Link2 className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 hover:bg-[var(--sidebar-bg)] rounded"><Image className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 hover:bg-[var(--sidebar-bg)] rounded"><Code className="w-3.5 h-3.5" /></button>
                <div className="h-4 w-px bg-[var(--editor-border)] mx-1" />

                <button className="p-1.5 hover:bg-[var(--sidebar-bg)] rounded"><Undo2 className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 hover:bg-[var(--sidebar-bg)] rounded"><Redo2 className="w-3.5 h-3.5" /></button>
            </div>

            {/* Editor Reading & Writing Body */}
            <div className="flex-1 overflow-y-auto px-10 py-8 max-w-4xl mx-auto w-full text-left space-y-7">
                {/* Title */}
                <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        updateActiveNote((prev) => ({ ...prev, title: e.target.value }));
                    }}
                    className="w-full text-3xl font-extrabold text-[var(--text-primary)] bg-transparent outline-none tracking-tight"
                    placeholder="Untitled note..."
                />

                {/* Goals Checklist */}
                <section className="space-y-3">
                    <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <span>🎯 Goals</span>
                    </h2>
                    <div className="space-y-2">
                        {goals.map((goal) => (
                            <label
                                key={goal.id}
                                onClick={() => toggleGoal(goal.id)}
                                className="flex items-center gap-2.5 cursor-pointer text-xs text-[var(--text-primary)] font-medium select-none"
                            >
                                <input
                                    type="checkbox"
                                    checked={goal.completed}
                                    onChange={() => { }}
                                    className="w-4 h-4 rounded border-[var(--editor-border)] accent-[var(--color-primary)] cursor-pointer"
                                />
                                <span className={goal.completed ? 'line-through text-[var(--text-muted)]' : ''}>
                                    {goal.text}
                                </span>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Timeline Table */}
                {timeline.length > 0 && (
                    <section className="space-y-3">
                        <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                            <span>📅 Timeline</span>
                        </h2>
                        <div className="border border-[var(--editor-border)] rounded-2xl overflow-hidden bg-[var(--sidebar-bg)]/40">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-[var(--editor-border)] text-[var(--text-muted)] font-semibold">
                                        <th className="py-2.5 px-4 font-semibold">Task</th>
                                        <th className="py-2.5 px-4 font-semibold">Deadline</th>
                                        <th className="py-2.5 px-4 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--editor-border)] text-[var(--text-secondary)] font-medium">
                                    {timeline.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-[var(--sidebar-bg)]/80">
                                            <td className="py-2.5 px-4 text-[var(--text-primary)] font-semibold">{row.task}</td>
                                            <td className="py-2.5 px-4 text-[var(--text-muted)]">{row.deadline}</td>
                                            <td className="py-2.5 px-4">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${row.statusColor === 'emerald'
                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                            : row.statusColor === 'amber'
                                                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                                                : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                                                        }`}
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                    <span>{row.status}</span>
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* Highlighted Notes Box */}
                {notesList.length > 0 && (
                    <section className="space-y-3">
                        <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                            <span>📝 Notes</span>
                        </h2>
                        <div className="p-4 rounded-2xl bg-[var(--card-active-bg)] border border-[var(--card-active-border)] space-y-2">
                            {notesList.map((noteText, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                                    <span className="text-[var(--text-accent)] font-bold">•</span>
                                    <span>{noteText}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Sprint Completion Progress Bar */}
                {goals.length > 0 && (
                    <div className="pt-4 border-t border-[var(--editor-border)] space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] font-medium">
                            <span>Sprint Completion: {completedGoalsCount} of {goals.length} Goals</span>
                            <span className="font-bold text-[var(--text-primary)]">{progressPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[var(--sidebar-bg)] overflow-hidden">
                            <div
                                className="h-full rounded-full bg-[var(--text-accent)] transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}