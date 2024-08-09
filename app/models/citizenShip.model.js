const mongoose = require('mongoose');

const citizenShipMasterSchema = new mongoose.Schema({
    citizenship_nme: String,
    citizenship_desc: String,
    citizenship_status: {
        type: String,
        enum: ['active', 'in-active']
    }
}, { collection: 'citizenship_master' });

module.exports = mongoose.model('citizenShipMaster', citizenShipMasterSchema);