const mongoose = require('mongoose');

const talukMasterSchema = new mongoose.Schema({
    id: Number,
    state_id: String,
    country_id: String,
    id_0: Number,
    name_0: String,
    id_1: Number,
    name_1: String,
    iso_code: String,
    id_2: Number,
    name_2: String,
    id_3: Number,
    name_3: String/*,
    taluk_status: {
        type: String,
        enum: ['active', 'in-active']
    }*/
}, { collection: 'taluk_master' });

module.exports = mongoose.model('talukMaster', talukMasterSchema);