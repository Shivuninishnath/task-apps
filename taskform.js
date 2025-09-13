import React, { useState, useEffect } from 'react';

export default function TaskForm({ onSubmit, editing, onUpdate, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editing) {
      setTitle(editing.title || '');
      setDescription(editing.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [editing]);

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Title is required');
    if (editing) {
      onUpdate(editing.id, { title: title.trim(), description: description.trim() });
    } else {
      onSubmit(title.trim(), description.trim());
    }
    setTitle('');
    setDescription('');
  };

  return (
    <form className="task-form" onSubmit={submit}>
      <input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="Short description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="form-actions">
        <button className="btn" type="submit">{editing ? 'Update' : 'Add'}</button>
        {editing && <button type="button" className="btn" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
