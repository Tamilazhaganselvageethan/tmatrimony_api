const mongoose = require('mongoose');

const casteMasterSchema = new mongoose.Schema({
    caste_nme: String,
    caste_desc: String,
    caste_status: {
        type: String,
        enum: ['active', 'in-active']
    }
}, { collection: 'caste_master' });

module.exports = mongoose.model('casteMaster', casteMasterSchema);