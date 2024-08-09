const mongoose = require('mongoose');

const gothramMasterSchema = new mongoose.Schema({
    gothram_nme: String,
    gothram_desc: String,
    gothram_status: {
        type: String,
        enum: ['active', 'in-active']
    }
}, { collection: 'gothram_master' });

module.exports = mongoose.model('gothramMaster', gothramMasterSchema);