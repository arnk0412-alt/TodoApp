import AsyncStorage from "@react-native-async-storage/async-storage";
import { Todo } from "../types/todo";

const KEY = "TODOS";

export const saveTodos = async (todos: Todo[]) => {
  await AsyncStorage.setItem(KEY, JSON.stringify(todos));
};

export const getTodos = async (): Promise<Todo[]> => {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};