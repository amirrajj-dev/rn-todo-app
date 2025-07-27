import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/store/theme.store";
import { useAuth } from "@/store/auth.store";
import { useTodoModal } from "@/store/todoModal.store";
import MyModal from "@/components/modal/MyModal";
import AddTodoModal from "@/components/todos/ui/AddTodoModal";
import TodoList from "@/components/todos/ui/TodoList";
import { useDeleteTodo } from "@/mutations/deleteTodo";
import FilterBox from "@/components/todos/ui/FilterBox";
import MotivationalQuote from "@/components/todos/ui/MotivationalQuote";
import ProgressBar from "@/components/todos/ui/ProgressBar";

const Home = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { modalType, isOpen, modalTitle, modalDescription, setModal, todoId } =
    useTodoModal();
  const { mutate: deleteTodo, isPending: isDeleting } = useDeleteTodo();

  if (!user) {
    return (
      <View
        className={`flex-1 items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <Text
          className={`text-lg ${theme === "dark" ? "text-white" : "text-gray-800"}`}
        >
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      className={`flex-1 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <ScrollView>
        <LinearGradient
          colors={
            theme === "dark" ? ["#1F2937", "#111827"] : ["#F3F4F6", "#E5E7EB"]
          }
          className="absolute inset-0"
        />
        <Animatable.View
          className="flex-1 px-6 mt-6"
          animation="fadeInUp"
          duration={1000}
        >
          <Text
            className={`text-3xl capitalize font-extrabold mb-4 text-center ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            {user.username}'s Todos
          </Text>
          <MotivationalQuote />
          <FilterBox />
          <ProgressBar />
          <TodoList />
        </Animatable.View>

        <MyModal
          title={modalTitle}
          description={modalDescription}
          haveCancelBtn={
            modalType === "delete" ||
            modalType === "success" ||
            modalType === "error"
          }
          haveConfirmBtn={modalType === "delete"}
          confirmBtnText="Delete"
          cancelBtnText={modalType === "delete" ? "Cancel" : "OK"}
          onConfirm={() => {
            if (modalType === "delete" && todoId) {
              deleteTodo(todoId);
            }
          }}
          isOpen={
            isOpen &&
            (modalType === "success" ||
              modalType === "error" ||
              modalType === "delete")
          }
          handleClose={() => setModal({ modalType: null })}
          isLoading={modalType === "delete" && isDeleting}
        />
        <AddTodoModal />
      </ScrollView>
      <TouchableOpacity
        className={`absolute bottom-6 right-6 w-16 h-16 rounded-full ${
          theme === "dark" ? "bg-blue-700" : "bg-blue-600"
        } justify-center items-center shadow-lg`}
        onPress={() => setModal({ modalType: "add" })}
      >
        <Animatable.View
          animation="pulse"
          iterationCount="infinite"
          duration={2000}
        >
          <Ionicons name="add" size={30} color="#FFFFFF" />
        </Animatable.View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;