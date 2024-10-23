import React, { useState, useEffect } from "react";

//create your first component
const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const API_URL = "https://playground.4geeks.com/todo/users/Joaquin95";

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        let response = await fetch(API_URL);
        if (!response.ok) throw new Error("User does not exist");

        let data = await response.json();
        console.log("Fetched data:", data);

        if (Array.isArray(data)) {
          setTodos(data);
        }
      } catch (error) {
        console.error("Error fetching todos:", error);
        
        const defaultTodos = [
          { label: "Make the bed", done: false },
          { label: "Wash the cars", done: false },
          { label: "Feed the dogs", done: false },
          { label: "Take my dog to get a grooming", done: false },
        ];
        await fetch(API_URL, {
          method: "POST",
          body: JSON.stringify(defaultTodos),
          headers: { "Content-Type": "application/json" },
        });
        
        fetchTodos();
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (newTodo.trim() !== "") {
      const updatedTodos = [...todos, { label: newTodo, done: false }];
      setTodos(updatedTodos);
      setNewTodo("");

      await updateTodos(updatedTodos);
    }
  };

  const removeTodo = async (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);

    await updateTodos(updatedTodos);
  };

  const clearTodos = async () => {
    setTodos([]);
    await fetch(API_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  };

  const updateTodos = async (updatedTodos) => {
    await fetch(API_URL, {
      method: "PUT",
      body: JSON.stringify(updatedTodos),
      headers: { "Content-Type": "application/json" },
    });
  };

  return (
    <div className="todo-container">
      <h1 className="todo-title">TodoList</h1>
      <form onSubmit={addTodo}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="todo-input"
        />
      </form>

      <ul className="todo-list">
        {todos.map((todo, index) => (
          <li key={index} className="todo-item">
            {todo.label}
            <button onClick={() => removeTodo(index)} className="delete-button">
              ✖
            </button>
          </li>
        ))}
      </ul>
      <div className="todo-footer">
        {todos.length} {todos.length === 1 ? "item" : "items"} left
      </div>
    </div>
  );
};

export default TodoList;
