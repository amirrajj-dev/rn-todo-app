import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import * as Animatable from "react-native-animatable"
import { useTheme } from '@/store/theme.store'
import { Ionicons } from '@expo/vector-icons'
import { useTodoModal } from '@/store/todoModal.store'

const NoTodoFound = () => {
    const {theme} = useTheme()
      const {setModal} = useTodoModal()
      
  return (
    <View className="flex-1 justify-center items-center px-6">
      <Animatable.View
        className={`w-11/12 max-w-md p-6 rounded-2xl ${
          theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/80'
        } shadow-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
        animation="fadeInUp"
        duration={1000}
      >
        <View className="items-center mb-4">
          <Ionicons
            name="clipboard-outline"
            size={48}
            color={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
          />
          <Text
            className={`text-xl font-bold mt-3 text-center ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}
          >
            No Todos Found
          </Text>
          <Text
            className={`text-base text-center mt-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Add a new todo or adjust your filters to see more!
          </Text>
        </View>
        <TouchableOpacity
          className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-blue-700' : 'bg-blue-600'
          } mx-auto`}
          onPress={() =>setModal({ modalType: 'add' })}
        >
          <Animatable.Text
            className="text-base font-semibold text-white"
            animation="pulse"
            iterationCount="infinite"
            duration={2000}
          >
            Add Todo
          </Animatable.Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  )
}

export default NoTodoFound