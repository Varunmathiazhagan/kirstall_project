const mongoose = require('mongoose');

const baseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Base name is required'],
    trim: true,
    maxlength: [100, 'Base name cannot exceed 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Base location is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  commander: {
    type: String,
    default: 'TBD'
  },
  capacity: {
    type: Number,
    default: 1000
  },
  established: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

const Base = mongoose.model('Base', baseSchema);

module.exports = Base;
