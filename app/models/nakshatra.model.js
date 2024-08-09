const mongoose = require('mongoose');

const nakshatraMasterSchema = new mongoose.Schema({
    natchr_nme: String,
    natchr_desc: String,
    natchr_status: {
        type: String,
        enum: ['active', 'in-active']
    }
}, { collection: 'natchra_master' });

module.exports = mongoose.model('nakshatraMaster', nakshatraMasterSchema);