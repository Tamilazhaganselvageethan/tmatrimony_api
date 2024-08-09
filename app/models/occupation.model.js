const mongoose = require('mongoose');

const occupationMasterSchema = new mongoose.Schema({
    occupation_nme: String,
    occupation_desc: String,
    occupation_status: {
        type: String,
        enum: ['active', 'in-active']
    }
}, { collection: 'occupation_master' });

module.exports = mongoose.model('occupationMaster', occupationMasterSchema);