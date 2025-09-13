import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, where, orderBy, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import TaskForm from './TaskForm';
import { v4 as uuidv4 } from 'uuid';

export default function TaskList({ user }) {
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'tasks'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const arr = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTasks(arr);
    });
    return unsubscribe;
  }, [user]);

  const addTask = async (title, description) => {
    const payload = {
      uid: user.uid,
      title,
      description,
      completed: false,
      createdAt: serverTimestamp(),
      clientId: uuidv4()
    };
    await addDoc(collection(db, 'tasks'), payload);
  };

  const updateTask = async (id, patch) => {
    const ref = doc(db, 'tasks', id);
    await updateDoc(ref, { ...patch });
    setEditing(null);
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await deleteDoc(doc(db, 'tasks', id));
  };

  const toggle = async (task) => {
    await updateDoc(doc(db, 'tasks', task.id), { completed: !task.completed });
  };

  return (
    <div className="task-area">
      <TaskForm onSubmit={addTask} editing={editing} onUpdate={updateTask} onCancel={() => setEditing(null)} />

      <h3>Your tasks</h3>
      {tasks.length === 0 && <div className="empty">No tasks yet — add one above.</div>}

      <ul className="task-list">
        {tasks.map((t) => (
          <li key={t.id} className={`task-item ${t.completed ? 'done' : ''}`}>
            <div className="left">
              <input type="checkbox" checked={!!t.completed} onChange={() => toggle(t)} />
              <div className="meta">
                <div className="title">{t.title}</div>
                {t.description && <div className="desc">{t.description}</div>}
              </div>
            </div>
            <div className="actions">
              <button className="btn small" onClick={() => setEditing(t)}>Edit</button>
              <button className="btn small danger" onClick={() => deleteTask(t.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
