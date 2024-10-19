import mongoose from 'mongoose';

const nodeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['operator', 'operand']
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    name: {
        type: String,
        default: null
    },
    left: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Node',
        default: null
    },
    right: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Node',
        default: null
    }
}, {
    timestamps: true
});

// Ensure references are populated when querying
nodeSchema.pre('find', function() {
    this.populate('left right');
});

nodeSchema.pre('findOne', function() {
    this.populate('left right');
});

const Node = mongoose.model('Node', nodeSchema);

export default Node;