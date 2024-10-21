const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    status: { type: String, enum: ['draft', 'publish', 'pending', 'future', 'private'], default: 'draft' },
    featuredMediaUrl: { type: String, default: '' },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

blogPostSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

blogPostSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('BlogPost', blogPostSchema);
