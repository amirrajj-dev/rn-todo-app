import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import * as Animatable from "react-native-animatable";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/store/theme.store";
import { useTodoModal } from "@/store/todoModal.store";
import { Todo } from "@/interfaces/entities";
import { useUpdateTodo } from "@/mutations/UpdateTodo";
import { useDeleteTodo } from "@/mutations/deleteTodo";
import EditTodoModal from "./EditTodoModal";
import MyModal from "@/components/modal/MyModal";

interface TodoItemProps {
  todo: Todo;
}

const TodoItem = ({ todo }: TodoItemProps) => {
  const { theme } = useTheme();
  const { modalType, isOpen, modalTitle, modalDescription, setModal, todoId } =
    useTodoModal();
  const { mutate: updateTodo, isPending: isUpdating } = useUpdateTodo();
  const { isPending: isDeleting } = useDeleteTodo();

  const priorityGradients : Record<string, [string, string]> = {
    low: ["#059669", "#10B981"],
    medium: ["#D97706", "#F59E0B"],
    high: ["#DC2626", "#F43F5E"],
  };

  const handleToggle = () => {
    updateTodo({ id: todo._id, completed: !todo.completed });
  };

  const handleDelete = () => {
    setModal({
      modalType: "delete",
      description: `Are you sure you want to delete "${todo.title}"?`,
      todoId: todo._id,
    });
  };

  return (
    <>
      <Animatable.View
        className={`p-5 rounded-2xl mb-3 ${
          theme === "dark" ? "bg-gray-800/80" : "bg-white/80"
        } shadow-sm border ${theme === "dark" ? "border-gray-600" : "border-gray-300"}`}
        animation="fadeInUp"
        duration={1000}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={handleToggle}
            disabled={isUpdating || isDeleting}
            className={`w-8 h-8 rounded-lg justify-center items-center`}
            activeOpacity={0.7}
          >
            <Animatable.View
              animation={todo.completed ? "bounceIn" : "bounceIn"}
              duration={600}
              style={{ transform: [{ scale: todo.completed ? 1 : 0.95 }] }}
            >
              <Ionicons
                name={todo.completed ? "checkmark-circle" : "square-outline"}
                size={24}
                color={
                  todo.completed
                    ? theme === "dark"
                      ? "#60A5FA"
                      : "#2563EB"
                    : "#9CA3AF"
                }
              />
            </Animatable.View>
          </TouchableOpacity>
          <View className="flex-1 ml-3">
            <Text
              className={`text-base font-extrabold ${
                theme === "dark" ? "text-white" : "text-gray-800"
              } ${todo.completed ? "line-through text-gray-400" : ""}`}
              numberOfLines={1}
            >
              {todo.title}
            </Text>
            {todo.description && (
              <Text
                className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"} mt-1`}
                numberOfLines={2}
              >
                {todo.description}
              </Text>
            )}
            {todo.dueDate && (
              <View className="flex-row items-center mt-1">
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                />
                <Text
                  className={`text-sm ml-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                >
                  Due:{" "}
                  {new Date(todo.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </Text>
              </View>
            )}
            {todo.priority && (
              <View
                className="mt-2 px-2 py-1"
              >
                <LinearGradient
                  colors={priorityGradients[todo.priority]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="px-2 py-1"
                  style={{
                    borderRadius : 4
                  }}
                >
                  <Text className="text-xs font-extrabold text-white">
                    {todo.priority.toUpperCase()}
                  </Text>
                </LinearGradient>
              </View>
            )}
          </View>
          <View className="flex-row gap-3 ml-3">
            <TouchableOpacity
              onPress={() => setModal({ modalType: "edit", todoId: todo._id })}
              disabled={isUpdating || isDeleting}
              className={`${theme === "dark" ? "bg-blue-600" : "bg-blue-500"} rounded-md p-1`}
            >
              <Animatable.View animation="bounceIn" duration={800}>
                <MaterialIcons
                  name="edit"
                  size={20}
                  color={"#fff"}
                />
              </Animatable.View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              disabled={isUpdating || isDeleting}
              className={`${isDeleting ? "opacity-50" : ""} ${theme === "dark" ? "bg-rose-600" : "bg-rose-500"} rounded-md p-1`}
            >
              <Animatable.View animation="bounceIn" duration={800}>
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color={"#fff"}
                />
              </Animatable.View>
            </TouchableOpacity>
          </View>
        </View>
      </Animatable.View>
      <MyModal
        title={modalTitle}
        description={modalDescription}
        haveCancelBtn={true}
        haveConfirmBtn={false}
        cancelBtnText="OK"
        isOpen={
          isOpen &&
          (modalType === "success" || modalType === "error") &&
          todo._id === todoId
        }
        handleClose={() => setModal({ modalType: null })}
      />
      <EditTodoModal todo={todo} />
    </>
  );
};

export default TodoItem;