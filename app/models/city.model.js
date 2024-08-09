const mongoose = require('mongoose');

const cityMasterSchema = new mongoose.Schema({
    city_nme: String,
    city_desc: String,
    city_status: {
        type: String,
        enum: ['active', 'in-active']
    },
    ref_district_id: String
}, { collection: 'city_master' });

module.exports = mongoose.model('cityMaster', cityMasterSchema);