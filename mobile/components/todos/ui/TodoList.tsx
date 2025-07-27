import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '@/store/theme.store';
import { useTodos } from '@/queries/useTodos';
import { useTodoFilter } from '@/store/todoFilter.store';
import TodoItem from './TodoItem';
import SkeletonLoader from '@/components/skeletons/SkeletonLoader';
import NoTodoFound from './NoTodoFound';

const TodoList = () => {
  const { theme } = useTheme();
  const { data: todos, isLoading, error } = useTodos();
  const { dateFilter, priorityFilter, searchQuery } = useTodoFilter();

  const filteredTodos = React.useMemo(() => {
    if (!todos) return [];
    return todos.filter((todo) => {
      // Search filter
      const search = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !search ||
        todo.title.toLowerCase().includes(search) ||
        (todo.description?.toLowerCase().includes(search) || false);

      // Priority filter
      const matchesPriority = priorityFilter === 'all' || todo.priority === priorityFilter;

      // Date filter
      let matchesDate = true;
      if (todo.dueDate && dateFilter !== 'all') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        if (dateFilter === 'today') {
          matchesDate = dueDate.getTime() === today.getTime();
        } else if (dateFilter === 'thisWeek') {
          const oneWeekLater = new Date(today);
          oneWeekLater.setDate(today.getDate() + 7);
          matchesDate = dueDate >= today && dueDate <= oneWeekLater;
        }
      }

      return matchesSearch && matchesPriority && matchesDate;
    });
  }, [todos, searchQuery, priorityFilter, dateFilter]);

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <View className="items-center justify-center py-6">
        <Animatable.View
          className={`w-11/12 max-w-md p-6 rounded-2xl ${
            theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/80'
          } shadow-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
          animation="fadeInUp"
          duration={1000}
        >
          <Text
            className={`text-lg font-semibold text-center ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}
          >
            Failed to load todos
          </Text>
        </Animatable.View>
      </View>
    );
  }

  if (!filteredTodos || filteredTodos.length === 0) {
    return <NoTodoFound />;
  }

  return (
    <Animatable.View animation="fadeInUp" duration={1000}>
      <ScrollView className=''>
        {filteredTodos.map((todo) => (
          <TodoItem key={todo._id} todo={todo} />
        ))}
      </ScrollView>
    </Animatable.View>
  );
};

export default TodoList;