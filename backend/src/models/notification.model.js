import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  todoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Todo',
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['reminder', 'update', 'overdue'],
    default: 'reminder',
  },
  isRead: {
    type: Boolean,
    default: false,
  }
} , {
    timestamps : true
});

const notificationsModel = mongoose.models.notification || mongoose.model("notification" , notificationSchema)

export default notificationsModel;