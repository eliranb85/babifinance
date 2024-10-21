const Jewelry = require('../models/Jewelry');

// Create a new jewelry entry
exports.createJewelry = async (req, res) => {
    try {
        const newEntry = new Jewelry(req.body);
        await newEntry.save();
        res.status(201).json({ message: 'Jewelry data stored successfully' });
    } catch (error) {
        console.error('Error storing jewelry data:', error);
        res.status(500).json({ error: 'Failed to store jewelry data' });
    }
};

// Get all jewelry entries
exports.getJewelry = async (req, res) => {
    try {
        const jewelryData = await Jewelry.find();
        res.json(jewelryData);
    } catch (error) {
        console.error('Error fetching jewelry data:', error);
        res.status(500).json({ error: 'Failed to fetch jewelry data' });
    }
};

// Delete a single jewelry entry
exports.deleteJewelry = async (req, res) => {
    try {
        await Jewelry.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Jewelry entry deleted successfully' });
    } catch (error) {
        console.error('Error deleting jewelry entry:', error);
        res.status(500).json({ error: 'Failed to delete jewelry entry' });
    }
};

// Delete all jewelry entries
exports.deleteAllJewelry = async (req, res) => {
    try {
        await Jewelry.deleteMany({});
        res.status(200).json({ message: 'All jewelry entries deleted successfully' });
    } catch (error) {
        console.error('Error deleting all jewelry entries:', error);
        res.status(500).json({ error: 'Failed to delete all jewelry entries' });
    }
};

// Update the Price for Customer
exports.updateJewelryPrice = async (req, res) => {
    try {
        const { id } = req.params;
        const { priceForCustomer } = req.body;

        const updatedEntry = await Jewelry.findByIdAndUpdate(
            id,
            { priceForCustomer },
            { new: true }
        );

        if (!updatedEntry) {
            return res.status(404).json({ error: 'Jewelry data not found' });
        }

        res.json({ message: 'Price updated successfully', updatedEntry });
    } catch (error) {
        console.error('Error updating price:', error);
        res.status(500).json({ error: 'Failed to update price' });
    }
};
