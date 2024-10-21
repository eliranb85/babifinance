const mongoose = require('mongoose');

const jewelrySchema = new mongoose.Schema({
    jewelryName: { type: String, required: true, trim: true },
    selectedGoldType: { type: String, required: true, trim: true },
    selectedCurrency: { type: String, required: true, trim: true },
    stonePrice: { type: Number, required: true },
    weight: { type: Number, required: true },
    settingPrice: { type: Number, required: true },
    extraCost: { type: Number, default: 0 },
    printCost: { type: Number, default: 0 },
    fixPrice: { type: Number, default: 0 },
    workTimeCost: { type: Number, default: 0 },
    totalPrice: { type: String, required: true },
    priceForCustomer: { type: String, required: true },
    date: { type: String, required: true }
}, {
    timestamps: true
});

jewelrySchema.index({ jewelryName: 'text', selectedGoldType: 'text' });

module.exports = mongoose.model('Jewelry', jewelrySchema, 'jewelries');
