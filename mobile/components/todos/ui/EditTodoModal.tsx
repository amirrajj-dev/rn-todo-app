import { View, TextInput, TouchableOpacity, Text, Modal, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@/store/theme.store';
import { useTodoModal } from '@/store/todoModal.store';
import { Todo } from '@/interfaces/entities';
import { useUpdateTodo } from '@/mutations/UpdateTodo';
import { Picker } from '@react-native-picker/picker';

interface EditTodoModalProps {
  todo: Todo;
}

const EditTodoModal = ({ todo }: EditTodoModalProps) => {
  const { theme } = useTheme();
  const { modalType, isOpen, todoId, setModal } = useTodoModal();
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [dueDate, setDueDate] = useState(todo.dueDate ? new Date(todo.dueDate) : undefined);
  const [priority, setPriority] = useState(todo.priority || 'low');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { mutate: updateTodo, isPending } = useUpdateTodo();

  const handleSave = () => {
    if (!title.trim()) {
      setModal({ modalType: 'error', description: 'Title cannot be empty' });
      return;
    }
    updateTodo({
      id: todo._id,
      title,
      description: description.trim() || undefined,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
      priority: priority || undefined,
    });
  };

  return (
    <Modal
      visible={isOpen && modalType === 'edit' && todo._id === todoId}
      transparent={true}
      animationType="none"
      onRequestClose={() => setModal({ modalType: null })}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <Animatable.View
          className={`w-11/12 max-w-md p-6 rounded-2xl ${
            theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/80'
          } shadow-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
          animation="zoomIn"
          duration={300}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text
              className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
            >
              Edit Todo
            </Text>
            <TouchableOpacity onPress={() => setModal({ modalType: null })}>
              <Ionicons
                name="close"
                size={24}
                color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
              />
            </TouchableOpacity>
          </View>
          <TextInput
            className={`p-3 rounded-lg mb-3 border ${
              theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-800'
            }`}
            placeholder="Todo title"
            placeholderTextColor={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
            value={title}
            onChangeText={setTitle}
            autoCapitalize="sentences"
          />
          <TextInput
            className={`p-3 rounded-lg mb-3 border ${
              theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-800'
            }`}
            placeholder="Description (optional)"
            placeholderTextColor={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
            value={description}
            onChangeText={setDescription}
            autoCapitalize="sentences"
            multiline
          />
          <TouchableOpacity
            className={`p-3 rounded-lg mb-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
            onPress={() => setShowDatePicker(true)}
          >
            <Text
              className={`${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
            >
              {dueDate ? new Date(dueDate).toLocaleDateString() : 'Set Due Date'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dueDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDueDate(selectedDate);
              }}
            />
          )}
          <View
            className={`rounded-lg mb-3 border ${
              theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
            }`}
          >
            <Picker
              selectedValue={priority}
              onValueChange={(value) => setPriority(value)}
              style={{
                color: theme === 'dark' ? '#FFFFFF' : '#1F2937'
              }}
            >
              <Picker.Item label="Low" value="low" />
              <Picker.Item label="Medium" value="medium" />
              <Picker.Item label="High" value="high" />
            </Picker>
          </View>
          <View className="flex-row justify-end gap-3">
            <TouchableOpacity
              className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}
              onPress={() => setModal({ modalType: null })}
              disabled={isPending}
            >
              <Text
                className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-700' : 'bg-blue-600'} ${
                isPending ? 'opacity-50' : ''
              }`}
              onPress={handleSave}
              disabled={isPending}
            >
              <Text className="text-white font-semibold">
                {isPending ? <ActivityIndicator size={20} color={"#fff"} /> : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>
    </Modal>
  );
};

export default EditTodoModal;