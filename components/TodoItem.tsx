import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Todo } from "../types/todo";

type Props = {
  item: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  darkMode?: boolean;
};

export default function TodoItem({ item, onToggle, onDelete, onEdit, darkMode }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDelete = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onDelete(item.id));
  };

  const cardBg = darkMode
    ? item.completed
      ? "#1f3d24"
      : "#1e1e1e"
    : item.completed
    ? "#d3f9d8"
    : "#fff";

  const textColor = darkMode ? "#ffffff" : "#000000";
  const editColor = darkMode ? "#8ab4f8" : "#1a73e8";
  const deleteColor = "#e53935";

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
        padding: 12,
        marginVertical: 6,
        backgroundColor: cardBg,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <TouchableOpacity onPress={() => onToggle(item.id)} style={{ flex: 1 }}>
        <Text
          style={{
            textDecorationLine: item.completed ? "line-through" : "none",
            color: textColor,
            fontSize: 16,
          }}
        >
          {item.title}
        </Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", gap: 16 }}>
        <TouchableOpacity onPress={() => onEdit(item.id)}>
          <Ionicons name="pencil" size={20} color={editColor} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash" size={20} color={deleteColor} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}