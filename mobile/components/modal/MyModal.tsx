import { View, Text, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/store/theme.store';

interface ModalI {
  title: string;
  isOpen : boolean;
  description: string;
  haveCancelBtn?: boolean;
  haveConfirmBtn?: boolean;
  confirmBtnText?: string;
  cancelBtnText?: string;
  onConfirm?: () => void;
  handleClose : ()=>void;
  isLoading?: boolean;
}

const MyModal: React.FC<ModalI> = ({
  title,
  description,
  haveCancelBtn = true,
  haveConfirmBtn = true,
  confirmBtnText = 'Confirm',
  cancelBtnText = 'Cancel',
  onConfirm,
  isOpen,
  handleClose,
  isLoading = false,
}) => {
  const { theme } = useTheme();

  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <Modal
      transparent={true}
      animationType="none"
      visible={isOpen}
      onRequestClose={handleClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50">
        <Animatable.View
          animation={isOpen ? 'zoomIn' : 'zoomOut'}
          duration={300}
          className={`w-4/5 rounded-xl p-6 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          } shadow-lg`}
        >
          <LinearGradient
            colors={theme === 'dark' ? ['#1F2937', '#111827'] : ['#F3F4F6', '#E5E7EB']}
            className="absolute inset-0 rounded-xl"
          />
          <Text
            className={`text-xl font-bold mb-2 text-center ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}
          >
            {title}
          </Text>
          <Text
            className={`text-base mb-4 text-center ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {description}
          </Text>
          <View className="flex-row justify-end gap-3">
            {haveCancelBtn && (
              <TouchableOpacity
                className={`px-4 py-2 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                }`}
                onPress={handleClose}
                disabled={isLoading}
              >
                <Text
                  className={`text-base font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {cancelBtnText}
                </Text>
              </TouchableOpacity>
            )}
            {haveConfirmBtn && (
              <TouchableOpacity
                className={`px-4 py-2 rounded-lg ${
                  theme === 'dark' ? 'bg-red-800' : 'bg-red-600'
                }`}
                onPress={handleConfirm}
                disabled={isLoading}
              >
                <Text className="text-base font-semibold text-white">
                  {isLoading ? <ActivityIndicator size={20} color={"#fff"} /> : confirmBtnText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Animatable.View>
      </View>
    </Modal>
  );
};

export default MyModal;