import { View, Text, TouchableOpacity, Switch } from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/store/theme.store';
import { useTodoModal } from '@/store/todoModal.store';
import { Todo } from '@/interfaces/entities';
import { useUpdateTodo } from '@/mutations/UpdateTodo';
import { useDeleteTodo } from '@/mutations/deleteTodo';
import EditTodoModal from './EditTodoModal';
import MyModal from '@/components/modal/MyModal';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem = ({ todo }: TodoItemProps) => {
  const { theme } = useTheme();
  const { modalType, isOpen, modalTitle, modalDescription, setModal , todoId } = useTodoModal();
  const { mutate: updateTodo, isPending: isUpdating } = useUpdateTodo();
  const { isPending: isDeleting } = useDeleteTodo();

  const priorityColors = {
    low: theme === 'dark' ? 'bg-emerald-600' : 'bg-emerald-500',
    medium: theme === 'dark' ? 'bg-amber-600' : 'bg-amber-500',
    high: theme === 'dark' ? 'bg-rose-600' : 'bg-rose-500',
  };

  const handleToggle = () => {
    updateTodo({ id: todo._id, completed: !todo.completed });
  };

  const handleDelete = () => {
    setModal({
      modalType: 'delete',
      description: `Are you sure you want to delete "${todo.title}"?`,
      todoId: todo._id,
    });
  };

  return (
    <>
      <Animatable.View
        className={`p-4 rounded-xl mb-3 ${theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/90'} shadow-md border ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}
        animation="fadeInUp"
        duration={1000}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Switch
              value={todo.completed}
              onValueChange={handleToggle}
              trackColor={{ false: '#9CA3AF', true: '#2563EB' }}
              thumbColor={theme === 'dark' ? '#FFFFFF' : '#F3F4F6'}
              disabled={isUpdating || isDeleting}
            />
            <View className="ml-3 flex-1">
              <Text
                className={`text-base font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                } ${todo.completed ? 'line-through text-gray-400' : ''}`}
                numberOfLines={2}
              >
                {todo.title}
              </Text>
              {todo.description && (
                <Text
                  className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                  numberOfLines={2}
                >
                  {todo.description}
                </Text>
              )}
              {todo.dueDate && (
                <Text
                  className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                >
                  Due: {new Date(todo.dueDate).toLocaleDateString()}
                </Text>
              )}
              {todo.priority && (
                <View
                  className={`mt-4 px-2 py-1 rounded-md ${priorityColors[todo.priority]}`}
                >
                  <Text className="text-xs font-extrabold text-white">{todo.priority.toUpperCase()}</Text>
                </View>
              )}
            </View>
          </View>
          <View className="flex-row gap-2 ml-2">
            <TouchableOpacity
              onPress={() => setModal({ modalType: 'edit', todoId: todo._id })}
              disabled={isUpdating || isDeleting}
            >
              <MaterialIcons
                name="edit"
                size={18}
                color={theme === 'dark' ? '#3B82F6' : '#2563EB'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              disabled={isUpdating || isDeleting}
              className={`${isDeleting ? 'opacity-50' : ''}`}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color={theme === 'dark' ? '#EF4444' : '#DC2626'}
              />
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
        isOpen={isOpen && (modalType === 'success' || modalType === 'error') && todo._id === todoId}
        handleClose={() => setModal({ modalType: null })}
      />
      <EditTodoModal todo={todo} />
    </>
  );
};

export default TodoItem;