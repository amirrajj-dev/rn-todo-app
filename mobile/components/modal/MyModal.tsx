import { View, Text, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '@/store/theme.store';

interface ModalI {
  title: string;
  isOpen: boolean;
  description: string;
  haveCancelBtn?: boolean;
  haveConfirmBtn?: boolean;
  confirmBtnText?: string;
  cancelBtnText?: string;
  onConfirm?: () => void;
  handleClose: () => void;
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
      <View className="flex-1 justify-center items-center bg-black/50">
        <Animatable.View
          animation={isOpen ? 'zoomIn' : 'zoomOut'}
          duration={300}
          className={`w-11/12 max-w-md p-6 rounded-2xl ${
            theme === 'dark' ? 'bg-gray-800/80' : 'bg-white/80'
          } shadow-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <Text
            className={`text-2xl font-bold mb-3 text-center ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}
          >
            {title}
          </Text>
          <Text
            className={`text-base mb-5 text-center ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {description}
          </Text>
          <View className="flex-row justify-end gap-3">
            {haveCancelBtn && (
              <TouchableOpacity
                className={`p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                } ${isLoading ? 'opacity-50' : ''}`}
                onPress={handleClose}
                disabled={isLoading}
              >
                <Animatable.Text
                  className={`text-base font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}
                  animation={isLoading ? undefined : 'pulse'}
                  iterationCount="infinite"
                  duration={2000}
                >
                  {cancelBtnText}
                </Animatable.Text>
              </TouchableOpacity>
            )}
            {haveConfirmBtn && (
              <TouchableOpacity
                className={`p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-blue-700' : 'bg-blue-600'
                } ${isLoading ? 'opacity-50' : ''}`}
                onPress={handleConfirm}
                disabled={isLoading}
              >
                <Animatable.Text
                  className="text-base font-semibold text-white"
                  animation={isLoading ? undefined : 'pulse'}
                  iterationCount="infinite"
                  duration={2000}
                >
                  {isLoading ? <ActivityIndicator size={20} color="#fff" /> : confirmBtnText}
                </Animatable.Text>
              </TouchableOpacity>
            )}
          </View>
        </Animatable.View>
      </View>
    </Modal>
  );
};

export default MyModal;