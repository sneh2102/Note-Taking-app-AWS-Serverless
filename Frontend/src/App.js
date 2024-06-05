import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const apiUrl = 'https://ushalmbgc8.execute-api.us-east-1.amazonaws.com/activity1';

function App() {
    const [notes, setNotes] = useState([]);
    const [noteContent, setNoteContent] = useState('');
    const [noteId, setNoteId] = useState('');
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const response = await axios.get(`${apiUrl}/notes`);
            setNotes(JSON.parse(response.data.body));
            console.log('Notes fetched:', notes);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const addNote = async () => {
        try {
            await axios.post(`${apiUrl}/add`, { noteId, content: noteContent });
            console.log('Note added successfully!');
            fetchNotes();
            setNoteContent('');
            setNoteId('');
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    const updateNote = async (id, content) => {
        try {
            await axios.put(`${apiUrl}/notes`, { noteId: id, content });
            fetchNotes();
            setEditMode(false);
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    const deleteNote = async (id) => {
        try {
            await axios.post(`${apiUrl}/notes`, { noteId: id });
            fetchNotes();
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    return (
        <div className="app-container">
            <h1>Note Taking App</h1>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Note ID"
                    value={noteId}
                    onChange={(e) => setNoteId(e.target.value)}
                />
                <textarea
                    placeholder="Note Content"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                />
                <button onClick={addNote}>Add Note</button>
            </div>
            <ul className="notes-list">
                {notes.map((note) => (
                    <li key={note.noteId} className="note-item">
                        <div className="note-header">
                            <span className="note-id">{note.noteId}</span>
                            <div className="note-actions">
                                <button
                                    className="edit-button"
                                    onClick={() => {
                                        setNoteId(note.noteId);
                                        setNoteContent(note.content);
                                        setEditMode(true);
                                    }}
                                >
                                    Edit
                                </button>
                                <button className="delete-button" onClick={() => deleteNote(note.noteId)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                        {editMode && noteId === note.noteId ? (
                            <div className="edit-container">
                                <textarea
                                    value={noteContent}
                                    onChange={(e) => setNoteContent(e.target.value)}
                                />
                                <button
                                    className="save-button"
                                    onClick={() => {
                                        updateNote(note.noteId, noteContent);
                                        setNoteId('');
                                        setNoteContent('');
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <p className="note-content">{note.content}</p>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
