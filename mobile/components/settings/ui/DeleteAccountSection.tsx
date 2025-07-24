import { TouchableOpacity, Text } from 'react-native';
import React, { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '@/store/theme.store';
import MyModal from '@/components/modal/MyModal';
import { useDeleteAccount } from '@/mutations/deleteAccount';


const DeleteAccountSection = () => {
  const { theme } = useTheme();
  const [isOpenDeleteModal , setIsOpenDeleteModal] = useState(false)
  const {mutate : deleteAccount , isPending , isSuccess , isError , error} = useDeleteAccount({setIsModal : setIsOpenDeleteModal})

  const handleDeleteAccount = () => {
    setIsOpenDeleteModal(true);
  };

  return (
    <>
      <Animatable.View animation="fadeIn" duration={1100}>
        <TouchableOpacity
          className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-red-800' : 'bg-red-600'}`}
          onPress={handleDeleteAccount}
          disabled={isPending}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {isPending ? 'Deleting...' : 'Delete Account'}
          </Text>
        </TouchableOpacity>
      </Animatable.View>
      <MyModal
        title={isSuccess ? 'Success' : isError ? 'Error' : 'Delete Account'}
        description={
          isSuccess
            ? 'Account deleted successfully'
            : isError
            ? (error as any)?.response?.data?.message || 'Failed to delete account'
            : 'Are you sure you want to delete your account? This action cannot be undone.'
        }
        haveCancelBtn={!isSuccess && !isError}
        haveConfirmBtn={!isSuccess && !isError}
        confirmBtnText="Delete"
        cancelBtnText="Cancel"
        onConfirm={() =>deleteAccount()}
        handleClose={()=>setIsOpenDeleteModal(false)}
        isLoading={isPending}
        isOpen={isOpenDeleteModal}
      />
    </>
  );
};

export default DeleteAccountSection;