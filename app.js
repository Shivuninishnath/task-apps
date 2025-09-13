import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import Auth from './components/Auth';
import TaskList from './components/TaskList';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>TaskFlow</h1>
        {user && (
          <div className="user-area">
            <span className="user-email">{user.email}</span>
            <button className="btn" onClick={() => signOut(auth)}>Sign out</button>
          </div>
        )}
      </header>

      <main className="main">
        {!user ? <Auth /> : <TaskList user={user} />}
      </main>

      <footer className="footer">Built with React + Firebase</footer>
    </div>
  );
}
