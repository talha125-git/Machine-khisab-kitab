import mongoose from 'mongoose';

const daySchema = new mongoose.Schema({
  dayNumber: Number,
  date: String,
  income: mongoose.Schema.Types.Mixed, // allows string or number
  notes: String,
  saved: Boolean,
});

const kitabSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: String,
  number: Number,
  startDate: String,
  endDate: String,
  days: [daySchema],
  completed: Boolean,
  createdAt: String,
});

const Kitab = mongoose.model('Kitab', kitabSchema);
export default Kitab;
