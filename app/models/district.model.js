const mongoose = require('mongoose');

const districtMasterSchema = new mongoose.Schema({
    id: Number,
    state_id: String,
    country_id: String,
    id_0: Number,
    name_0: String,
    id_1: Number,
    name_1: String,
    iso_code: String,
    id_2: Number,
    name_2: String/*,
    district_status: {
        type: String,
        enum: ['active', 'in-active']
    },
    ref_state_id: String*/
}, { collection: 'district_master' });

module.exports = mongoose.model('districtMaster', districtMasterSchema);