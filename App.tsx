import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
} from "react-native";

import { Todo } from "./types/todo";
import { generateId } from "./utils/generateId";
import { getTodos, saveTodos } from "./services/storageService";
import TodoItem from "./components/TodoItem";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const loadTodos = async () => {
    const data = await getTodos();
    setTodos(data);
  };

  const addTodo = () => {
    if (text.trim() === "") {
      Alert.alert("Error", "Todo cannot be empty");
      return;
    }

    if (editingId) {
      setTodos((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, title: text } : t))
      );
      setEditingId(null);
    } else {
      const newTodo: Todo = {
        id: generateId(),
        title: text,
        completed: false,
        createdAt: Date.now(),
      };
      setTodos([newTodo, ...todos]);
    }

    setText("");
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const editTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      setText(todo.title);
      setEditingId(id);
    }
  };

  const filteredTodos = todos
    .filter((t) => {
      if (filter === "completed") return t.completed;
      if (filter === "pending") return !t.completed;
      return true;
    })
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  // ---- THEME COLORS ----
  const theme = {
    background: darkMode ? "#121212" : "#ffffff",
    text: darkMode ? "#ffffff" : "#000000",
    inputBg: darkMode ? "#1e1e1e" : "#ffffff",
    inputBorder: darkMode ? "#444" : "#ccc",
    placeholder: darkMode ? "#888" : "#999",
  };

  return (
    <View style={{ flex: 1, padding: 20, marginTop: 40, backgroundColor: theme.background }}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: theme.text }}>
          Todo App
        </Text>

        <TouchableOpacity
          onPress={() => setDarkMode(!darkMode)}
          style={{
            backgroundColor: darkMode ? "#333" : "#eee",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: theme.text }}>{darkMode ? "☀️ Light" : "🌙 Dark"}</Text>
        </TouchableOpacity>
      </View>

      {/* INPUT */}
      <TextInput
        placeholder="Enter todo"
        placeholderTextColor={theme.placeholder}
        value={text}
        onChangeText={setText}
        style={{
          borderWidth: 1,
          borderColor: theme.inputBorder,
          backgroundColor: theme.inputBg,
          color: theme.text,
          padding: 10,
          marginVertical: 10,
          borderRadius: 8,
        }}
      />

      <TouchableOpacity
        onPress={addTodo}
        style={{
          backgroundColor: "blue",
          padding: 12,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          {editingId ? "Update Todo" : "Add Todo"}
        </Text>
      </TouchableOpacity>

      {/* SEARCH */}
      <TextInput
        placeholder="Search todos"
        placeholderTextColor={theme.placeholder}
        value={search}
        onChangeText={setSearch}
        style={{
          borderWidth: 1,
          borderColor: theme.inputBorder,
          backgroundColor: theme.inputBg,
          color: theme.text,
          padding: 8,
          marginVertical: 10,
          borderRadius: 8,
        }}
      />

      {/* FILTER */}
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        {["all", "completed", "pending"].map((f) => (
          <TouchableOpacity key={f} onPress={() => setFilter(f as any)}>
            <Text
              style={{
                fontWeight: filter === f ? "bold" : "normal",
                color: theme.text,
              }}
            >
              {f.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LIST */}
      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem
            item={item}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
            darkMode={darkMode}
          />
        )}
      />
    </View>
  );
}