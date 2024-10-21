const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' }
}, {
    timestamps: true
});

tagSchema.index({ name: 1 });
tagSchema.index({ slug: 1 });

module.exports = mongoose.model('Tag', tagSchema);
