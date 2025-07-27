import { create } from 'zustand';

type ModalType = 'add' | 'edit' | 'delete' | 'success' | 'error' | null;

interface TodoModalState {
  modalType: ModalType;
  isOpen: boolean;
  modalTitle: string;
  modalDescription: string;
  todoId?: string; // For edit/delete modals
  setModal: (params: {
    modalType: ModalType;
    title?: string;
    description?: string;
    todoId?: string;
  }) => void;
}

export const useTodoModal = create<TodoModalState>((set) => ({
  modalType: null,
  isOpen: false,
  modalTitle: '',
  modalDescription: '',
  todoId: undefined,
  setModal: ({ modalType, title, description, todoId }) =>
    set({
      modalType,
      isOpen: !!modalType,
      modalTitle: title || getDefaultTitle(modalType),
      modalDescription: description || getDefaultDescription(modalType),
      todoId: modalType === 'edit' || modalType === 'delete' ? todoId : undefined,
    }),
}));

const getDefaultTitle = (modalType: ModalType): string => {
  switch (modalType) {
    case 'add':
      return 'Add New Todo';
    case 'edit':
      return 'Edit Todo';
    case 'delete':
      return 'Delete Todo';
    case 'success':
      return 'Success';
    case 'error':
      return 'Error';
    default:
      return '';
  }
};

const getDefaultDescription = (modalType: ModalType): string => {
  switch (modalType) {
    case 'success':
      return 'Operation completed successfully';
    case 'error':
      return 'An error occurred';
    default:
      return '';
  }
};