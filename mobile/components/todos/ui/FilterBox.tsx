import { View, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import * as Animatable from "react-native-animatable"
import { useTheme } from '@/store/theme.store'
import { useTodoFilter } from '@/store/todoFilter.store'
import { dateFilters, priorityFilters } from '@/helpers/helpers'

const FilterBox = () => {
    const {theme} = useTheme()
    const {setSearchQuery , priorityFilter , dateFilter , setDateFilter , setPriorityFilter} = useTodoFilter()
  return (
   <Animatable.View
          className={`p-4 rounded-2xl mb-4 ${
            theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/80'
          } shadow-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
          animation="fadeInUp"
          duration={1000}
          delay={200}
        >
          <TextInput
            className={`p-3 rounded-lg mb-3 ${
              theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
            } border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
            placeholder="Search todos..."
            placeholderTextColor={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          <View className="flex-row justify-between mb-3">
            {dateFilters.map(({ label, value }) => (
              <TouchableOpacity
                key={value}
                className={`flex-1 mx-1 p-2 rounded-lg ${
                  dateFilter === value
                    ? theme === 'dark'
                      ? 'bg-blue-700'
                      : 'bg-blue-600'
                    : theme === 'dark'
                      ? 'bg-gray-700'
                      : 'bg-gray-300'
                }`}
                onPress={() => setDateFilter(value)}
              >
                <Animatable.Text
                  className={`text-center text-sm font-semibold ${
                    dateFilter === value ? 'text-white' : theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}
                  animation={dateFilter === value ? 'pulse' : undefined}
                  iterationCount="infinite"
                  duration={2000}
                >
                  {label}
                </Animatable.Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="flex-row justify-between">
            {priorityFilters.map(({ label, value }) => (
              <TouchableOpacity
                key={value}
                className={`flex-1 mx-1 p-2 rounded-lg ${
                  priorityFilter === value
                    ? theme === 'dark'
                      ? 'bg-blue-700'
                      : 'bg-blue-600'
                    : theme === 'dark'
                      ? 'bg-gray-700'
                      : 'bg-gray-300'
                }`}
                onPress={() => setPriorityFilter(value)}
              >
                <Animatable.Text
                  className={`text-center text-sm font-semibold ${
                    priorityFilter === value ? 'text-white' : theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}
                  animation={priorityFilter === value ? 'pulse' : undefined}
                  iterationCount="infinite"
                  duration={2000}
                >
                  {label}
                </Animatable.Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animatable.View>
  )
}

export default FilterBox