const mongoose = require('mongoose');

const religionMasterSchema = new mongoose.Schema({
    religion_nme: String,
    religion_desc: String,
    religion_status: {
        type: String,
        enum: ['active', 'in-active']
    }
}, { collection: 'religion_master' });

module.exports = mongoose.model('religionMaster', religionMasterSchema);