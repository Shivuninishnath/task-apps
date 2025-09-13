import React, { useState, useEffect } from "react";
import Auth from "./components/Auth.jsx";
import TaskList from "./components/TaskList.jsx";
import TaskForm from "./components/TaskForm.jsx";
import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const q = query(
          collection(db, "tasks"),
          where("uid", "==", currentUser.uid)
        );
        const unsubTasks = onSnapshot(q, (snapshot) => {
          setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubTasks();
      } else {
        setTasks([]);
      }
    });
    return () => unsubAuth();
  }, []);

  const addTask = async (text) => {
    if (!text.trim()) return;
    await addDoc(collection(db, "tasks"), {
      text,
      completed: false,
      uid: user.uid
    });
  };

  const toggleTask = async (id, completed) => {
    await updateDoc(doc(db, "tasks", id), { completed: !completed });
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  return (
    <div className="app">
      <h1>TaskFlow</h1>
      {user ? (
        <>
          <button className="signout-btn" onClick={() => signOut(auth)}>
            Sign Out
          </button>
          <TaskForm addTask={addTask} />
          <TaskList tasks={tasks} toggleTask={toggleTask} deleteTask={deleteTask} />
        </>
      ) : (
        <Auth />
      )}
    </div>
  );
}

export default App;
