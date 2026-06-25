import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api/tasks/";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get(API);
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!title.trim()) return;
    setLoading(true);
    await axios.post(API, { title, description, status: "pending" });
    setTitle("");
    setDescription("");
    await fetchTasks();
    setLoading(false);
  };

  const toggleStatus = async (id) => {
    await axios.patch(`${API}${id}/toggle_status/`);
    await fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}${id}/`);
    await fetchTasks();
  };

  const pending = tasks.filter((t) => t.status === "pending");
  const completed = tasks.filter((t) => t.status === "completed");

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>📝 Task Manager</h1>
      <p style={styles.sub}>Built with Django REST API + React</p>

      {/* Add Task Form */}
      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <input
          style={styles.input}
          placeholder="Description (optional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          style={styles.addBtn}
          onClick={addTask}
          disabled={loading}
        >
          {loading ? "Adding..." : "+ Add Task"}
        </button>
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        <span style={styles.statBadgePending}>⏳ Pending: {pending.length}</span>
        <span style={styles.statBadgeDone}>✅ Completed: {completed.length}</span>
      </div>

      {/* Task List */}
      {tasks.length === 0 && (
        <p style={styles.empty}>No tasks yet. Add your first task above!</p>
      )}

      {pending.length > 0 && (
        <>
          <h2 style={styles.sectionTitle}>⏳ Pending</h2>
          {pending.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={toggleStatus}
              onDelete={deleteTask}
            />
          ))}
        </>
      )}

      {completed.length > 0 && (
        <>
          <h2 style={styles.sectionTitle}>✅ Completed</h2>
          {completed.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={toggleStatus}
              onDelete={deleteTask}
            />
          ))}
        </>
      )}
    </div>
  );
}

function TaskCard({ task, onToggle, onDelete }) {
  const done = task.status === "completed";
  return (
    <div style={{ ...styles.card, opacity: done ? 0.7 : 1 }}>
      <div style={styles.cardLeft}>
        <h3 style={{
          ...styles.cardTitle,
          textDecoration: done ? "line-through" : "none",
          color: done ? "#888" : "#1a1a2e"
        }}>
          {task.title}
        </h3>
        {task.description && (
          <p style={styles.cardDesc}>{task.description}</p>
        )}
        <span style={styles.cardDate}>
          {new Date(task.created_at).toLocaleDateString()}
        </span>
      </div>
      <div style={styles.cardRight}>
        <button
          style={done ? styles.undoBtn : styles.doneBtn}
          onClick={() => onToggle(task.id)}
        >
          {done ? "↩ Undo" : "✓ Done"}
        </button>
        <button
          style={styles.deleteBtn}
          onClick={() => onDelete(task.id)}
        >
          🗑
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "680px",
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', sans-serif",
    background: "#f0f2f5",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "2rem",
    color: "#1a1a2e",
    marginBottom: "4px",
    textAlign: "center",
  },
  sub: {
    textAlign: "center",
    color: "#888",
    marginBottom: "32px",
    fontSize: "0.9rem",
  },
  form: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    marginBottom: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    fontSize: "1rem",
    outline: "none",
  },
  addBtn: {
    padding: "12px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "600",
  },
  stats: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
  },
  statBadgePending: {
    background: "#fff3cd",
    color: "#856404",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  statBadgeDone: {
    background: "#d1fae5",
    color: "#065f46",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    color: "#aaa",
    marginTop: "40px",
  },
  sectionTitle: {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "12px",
    fontWeight: "600",
  },
  card: {
    background: "#fff",
    borderRadius: "10px",
    padding: "16px 20px",
    marginBottom: "12px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLeft: { flex: 1 },
  cardTitle: { margin: "0 0 4px", fontSize: "1rem" },
  cardDesc: { color: "#888", fontSize: "0.85rem", margin: "0 0 4px" },
  cardDate: { color: "#bbb", fontSize: "0.75rem" },
  cardRight: { display: "flex", gap: "8px", marginLeft: "16px" },
  doneBtn: {
    padding: "6px 14px",
    background: "#d1fae5",
    color: "#065f46",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.85rem",
  },
  undoBtn: {
    padding: "6px 14px",
    background: "#e0e7ff",
    color: "#3730a3",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.85rem",
  },
  deleteBtn: {
    padding: "6px 10px",
    background: "#fee2e2",
    color: "#991b1b",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
};