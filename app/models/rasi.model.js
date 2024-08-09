const mongoose = require('mongoose');

const rasiMasterSchema = new mongoose.Schema({
    rasi_nme: String,
    rasi_desc: String,
    rasi_status: {
        type: String,
        enum: ['active', 'in-active']
    }
}, { collection: 'rasi_master' });

module.exports = mongoose.model('rasiMaster', rasiMasterSchema);