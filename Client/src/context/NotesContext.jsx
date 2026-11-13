/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const NotesContext = createContext(null);

const INITIAL_NOTES = [
    {
        id: 'note-1',
        title: 'Project Planning',
        folder: 'Work',
        sprint: 'Sprint 24',
        pinned: true,
        tag: 'Work',
        tagColor: '#ea580c',
        timestamp: 'Today',
        lastSaved: 'Saved 2 mins ago',
        preview: 'Tasks, timeline and key milestones for the MVP launch...',
        content: {
            goals: [
                { id: 1, text: 'Finalize project requirements', completed: true },
                { id: 2, text: 'Design UI screens', completed: false },
                { id: 3, text: 'Set up development environment', completed: false },
                { id: 4, text: 'Start implementation', completed: false },
            ],
            timeline: [
                { task: 'Requirements', deadline: 'Oct 12', status: 'Completed', statusColor: 'emerald' },
                { task: 'UI Design', deadline: 'Oct 15', status: 'In Progress', statusColor: 'amber' },
                { task: 'Development', deadline: 'Oct 22', status: 'Pending', statusColor: 'slate' },
            ],
            notes: [
                'Keep the design minimal, editorial, and clean.',
                'Use React + Tailwind for frontend architecture.',
                'Store data locally for the first version with zero latency.',
            ],
        },
    },
    {
        id: 'note-2',
        title: 'React Notes',
        folder: 'Study',
        pinned: false,
        tag: 'Study',
        tagColor: '#3b82f6',
        timestamp: 'Yesterday',
        lastSaved: 'Saved yesterday',
        preview: 'Hooks, state, and components architecture pattern summary...',
        content: {
            goals: [
                { id: 1, text: 'Review useEffect dependency arrays', completed: true },
                { id: 2, text: 'Explore React 19 Actions', completed: false },
            ],
            timeline: [],
            notes: ['Composition over inheritance pattern helps build scalable views.'],
        },
    },
    {
        id: 'note-3',
        title: 'Reading List',
        folder: 'Personal',
        pinned: false,
        tag: 'Personal',
        tagColor: '#ec4899',
        timestamp: 'Oct 10',
        lastSaved: 'Saved 3 days ago',
        preview: 'Books to read this month: Designing Data-Intensive Applications...',
        content: {
            goals: [
                { id: 1, text: 'Read Chapter 3 of Designing Data', completed: true },
                { id: 2, text: 'Take notes on storage engines', completed: false },
            ],
            timeline: [],
            notes: ['LSM trees vs B-trees trade-offs.'],
        },
    },
    {
        id: 'note-4',
        title: 'App Ideas',
        folder: 'Ideas',
        pinned: false,
        tag: 'Ideas',
        tagColor: '#10b981',
        timestamp: 'Oct 8',
        lastSaved: 'Saved Oct 8',
        preview: 'Note taking, habit tracker, task app and markdown sync tool...',
        content: {
            goals: [{ id: 1, text: 'Benchmark markdown editors', completed: true }],
            timeline: [],
            notes: ['Focus on keyboard accessibility and serenity.'],
        },
    },
    {
        id: 'note-5',
        title: 'Weekly Retrospective',
        folder: 'Work',
        pinned: false,
        tag: 'Work',
        tagColor: '#ea580c',
        timestamp: 'Sep 29',
        lastSaved: 'Saved Sep 29',
        preview: 'Sprint cycle review and feedback notes from the team demo...',
        content: {
            goals: [],
            timeline: [],
            notes: ['Good progress made on auth flows.'],
        },
    },
];

export function NotesProvider({ children }) {
    const [notes, setNotes] = useState(() => {
        try {
            const saved = localStorage.getItem('notecraft_dashboard_notes');
            return saved ? JSON.parse(saved) : INITIAL_NOTES;
        } catch {
            return INITIAL_NOTES;
        }
    });

    const [activeNoteId, setActiveNoteId] = useState('note-1');
    const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Work' | 'Study' | 'Personal' | 'Ideas'
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        localStorage.setItem('notecraft_dashboard_notes', JSON.stringify(notes));
    }, [notes]);

    const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

    const updateActiveNote = (updater) => {
        setNotes((prevNotes) =>
            prevNotes.map((n) => (n.id === activeNoteId ? updater(n) : n))
        );
    };

    const createNewNote = () => {
        const newNote = {
            id: 'note-' + Date.now(),
            title: 'Untitled Note',
            folder: 'Work',
            pinned: false,
            tag: 'Work',
            tagColor: '#ea580c',
            timestamp: 'Just now',
            lastSaved: 'Saved just now',
            preview: 'Start writing your note content here...',
            content: {
                goals: [{ id: 1, text: 'First milestone item', completed: false }],
                timeline: [],
                notes: ['Write project guidelines or thoughts here.'],
            },
        };
        setNotes([newNote, ...notes]);
        setActiveNoteId(newNote.id);
    };

    return (
        <NotesContext.Provider
            value={{
                notes,
                activeNote,
                activeNoteId,
                setActiveNoteId,
                activeFilter,
                setActiveFilter,
                searchQuery,
                setSearchQuery,
                updateActiveNote,
                createNewNote,
            }}
        >
            {children}
        </NotesContext.Provider>
    );
}

export function useNotes() {
    const context = useContext(NotesContext);
    if (!context) throw new Error('useNotes must be used within NotesProvider');
    return context;
}