// controllers/tagController.js

const Tag = require('../models/Tag');

// Create a new tag
exports.createTag = async (req, res) => {
    const { name, slug, description } = req.body;

    if (!name || !slug) {
        return res.status(400).json({ error: 'Name and slug are required.' });
    }

    try {
        // Check if the tag already exists
        const existingTag = await Tag.findOne({ $or: [{ name }, { slug }] });
        if (existingTag) {
            return res.status(400).json({ error: 'Tag with the same name or slug already exists.' });
        }

        const newTag = new Tag({
            name,
            slug,
            description
        });

        const savedTag = await newTag.save();
        res.status(201).json({ message: 'Tag created successfully.', tag: savedTag });
    } catch (error) {
        console.error('Error creating tag:', error);
        res.status(500).json({ error: 'Failed to create tag.' });
    }
};

// Get all tags
exports.getAllTags = async (req, res) => {
    try {
        const tags = await Tag.find().sort({ name: 1 }); // Sort tags alphabetically by name
        res.status(200).json(tags);
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({ error: 'Failed to fetch tags.' });
    }
};

// Get a single tag by ID
exports.getTagById = async (req, res) => {
    const { id } = req.params;

    try {
        const tag = await Tag.findById(id);
        if (!tag) {
            return res.status(404).json({ error: 'Tag not found.' });
        }
        res.status(200).json(tag);
    } catch (error) {
        console.error('Error fetching tag:', error);
        res.status(500).json({ error: 'Failed to fetch tag.' });
    }
};

// Update a tag by ID
exports.updateTag = async (req, res) => {
    const { id } = req.params;
    const { name, slug, description } = req.body;

    try {
        // Check if the new name or slug already exists in another tag
        const existingTag = await Tag.findOne({ 
            $or: [{ name }, { slug }],
            _id: { $ne: id } // Exclude the current tag
        });
        if (existingTag) {
            return res.status(400).json({ error: 'Another tag with the same name or slug already exists.' });
        }

        const updatedTag = await Tag.findByIdAndUpdate(
            id,
            { name, slug, description },
            { new: true, runValidators: true }
        );

        if (!updatedTag) {
            return res.status(404).json({ error: 'Tag not found.' });
        }

        res.status(200).json({ message: 'Tag updated successfully.', tag: updatedTag });
    } catch (error) {
        console.error('Error updating tag:', error);
        res.status(500).json({ error: 'Failed to update tag.' });
    }
};

// Delete a tag by ID
exports.deleteTag = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTag = await Tag.findByIdAndDelete(id);
        if (!deletedTag) {
            return res.status(404).json({ error: 'Tag not found.' });
        }
        res.status(200).json({ message: 'Tag deleted successfully.' });
    } catch (error) {
        console.error('Error deleting tag:', error);
        res.status(500).json({ error: 'Failed to delete tag.' });
    }
};
