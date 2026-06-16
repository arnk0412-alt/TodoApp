import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Todo } from "../types/todo";

type Props = {
  item: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

export default function TodoItem({ item, onToggle, onDelete, onEdit }: Props) {
  return (
    <View
      style={{
        padding: 12,
        marginVertical: 6,
        backgroundColor: item.completed ? "#d3f9d8" : "#fff",
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <TouchableOpacity onPress={() => onToggle(item.id)}>
        <Text style={{ textDecorationLine: item.completed ? "line-through" : "none" }}>
          {item.title}
        </Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <TouchableOpacity onPress={() => onEdit(item.id)}>
          <Text>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onDelete(item.id)}>
          <Text style={{ color: "red" }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}