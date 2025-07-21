// models/RefreshToken.js
import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
},{
  timestamps: true
});

const refreshTokensModel = mongoose.models.refreshToken || mongoose.model("refreshToken" , refreshTokenSchema)

export default refreshTokensModel;