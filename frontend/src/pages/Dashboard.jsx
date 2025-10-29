import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getTasks, createTask, updateTask, deleteTask } from "../api/api";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, PlusCircle, Trash2, Search } from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadTasks = async () => {
    const { data } = await getTasks();
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    await createTask({ title: newTask });
    setNewTask("");
    loadTasks();
  };

  const toggleComplete = async (task) => {
    await updateTask(task._id, { completed: !task.completed });
    loadTasks();
  };

  const removeTask = async (id) => {
    await deleteTask(id);
    loadTasks();
  };

  // Filtered tasks based on search input
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      {/* Header Section */}
      <motion.div
        className="w-full max-w-2xl flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div>
          <h1 className="text-3xl font-semibold">Welcome, {user?.fullName}</h1>
          <p className="text-gray-400 text-sm">Email: {user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </motion.div>

      {/* Task Input & Search */}
      <motion.div
        className="w-full max-w-2xl flex flex-col sm:flex-row gap-3 mb-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <form onSubmit={addTask} className="flex gap-2 w-full sm:w-2/3">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
          >
            <PlusCircle size={18} /> Add
          </button>
        </form>

        {/* Search Bar */}
        <motion.div
          className="flex items-center bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 w-full sm:w-1/3"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-white w-full placeholder-gray-500"
          />
        </motion.div>
      </motion.div>

      {/* Task List */}
      <motion.div
        className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {filteredTasks.length === 0 ? (
          <p className="text-gray-400 text-center">No matching tasks found!</p>
        ) : (
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex justify-between items-center border-b border-gray-800 last:border-0 py-3"
              >
                <div
                  onClick={() => toggleComplete(task)}
                  className={`cursor-pointer text-lg ${
                    task.completed
                      ? "line-through text-gray-500"
                      : "text-white hover:text-blue-400 transition"
                  }`}
                >
                  {task.title}
                </div>
                <button
                  onClick={() => removeTask(task._id)}
                  className="text-red-500 hover:text-red-400 transition"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>

      {/* Footer */}
      <motion.p
        className="text-gray-500 mt-8 text-sm text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        ✨ Stay organized. Stay productive.
      </motion.p>
    </div>
  );
}
