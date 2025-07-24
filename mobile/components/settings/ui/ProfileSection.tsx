import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '@/store/theme.store';
import { User } from '@/interfaces/entities';
import MyModal from '@/components/modal/MyModal';
import { useUpdateProfile } from '@/mutations/updateProfile';

type AvatarKeys = 'boy1.png' | 'boy2.png' | 'boy3.png' | 'girl1.png' | 'girl2.png' | 'girl3.png';

const avatars: Record<AvatarKeys, any> = {
  'boy1.png': require('../../../assets/avatars/boy1.png'),
  'boy2.png': require('../../../assets/avatars/boy2.png'),
  'boy3.png': require('../../../assets/avatars/boy3.png'),
  'girl1.png': require('../../../assets/avatars/girl1.png'),
  'girl2.png': require('../../../assets/avatars/girl2.png'),
  'girl3.png': require('../../../assets/avatars/girl3.png'),
};

interface ProfileSectionProps {
  user: User;
  setUser: (user: User | null) => void;
  isNotificationsEnabled: boolean;
}

const ProfileSection = ({ user, setUser, isNotificationsEnabled }: ProfileSectionProps) => {
  const { theme } = useTheme();
  const [isOpenProfileModal , setIsOpenProfileModal] = useState(false)
  const {mutate : updateProfile , isSuccess , isError , error , isPending} = useUpdateProfile({isNotificationsEnabled , setIsModal : setIsOpenProfileModal})

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setIsOpenProfileModal(true); // Show permission denied modal
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      const image = {
        uri: result.assets[0].uri,
        name: `profile-${user._id}.jpg`,
        type: 'image/jpeg',
      };
      updateProfile({image})
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setIsOpenProfileModal(true); // Show permission denied modal
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      const image = {
        uri: result.assets[0].uri,
        name: `profile-${user._id}.jpg`,
        type: 'image/jpeg',
      };
      updateProfile({image})
    }
  };

  return (
    <>
      <Animatable.View
        className={`p-4 rounded-xl mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
        animation="fadeIn"
        duration={800}
      >
        <View className="items-center mb-4">
          <Image
            source={user.profilePic.includes('http') ? { uri: user.profilePic } : avatars[user.profilePic as AvatarKeys]}
            className="w-24 h-24 rounded-full border-2 border-blue-500"
          />
          <Text
            className={`mt-2 text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
          >
            {user.username}
          </Text>
        </View>
        <View className="flex-row justify-center gap-4">
          <TouchableOpacity
            className={`flex-1 p-3 rounded-xl ${theme === 'dark' ? 'bg-blue-700' : 'bg-blue-600'}`}
            onPress={takePhoto}
            disabled={isPending}
          >
            <Text className="text-white text-center font-semibold">Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 p-3 rounded-xl ${theme === 'dark' ? 'bg-blue-700' : 'bg-blue-600'}`}
            onPress={pickImage}
            disabled={isPending}
          >
            <Text className="text-white text-center font-semibold">Choose Photo</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
      <MyModal
        title={
          isSuccess
            ? 'Success'
            : isError
            ? 'Error'
            : 'Permission Denied'
        }
        description={
          isSuccess
            ? 'Profile updated successfully'
            : isError
            ? (error as any)?.response?.data?.message || 'Failed to update profile'
            : 'Please allow access to photos or camera'
        }
        haveCancelBtn={false}
        haveConfirmBtn={true}
        handleClose={()=>setIsOpenProfileModal(false)}
        isOpen={isOpenProfileModal}
        isLoading={isPending}
        confirmBtnText='ok'
        onConfirm={()=>setIsOpenProfileModal(false)}
      />
    </>
  );
};

export default ProfileSection;