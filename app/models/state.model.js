const mongoose = require('mongoose');

const stateMasterSchema = new mongoose.Schema({
    id: Number,
    state_id: String,
    country_id: String,
    id_0: Number,
    name_0: String,
    id_1: Number,
    name_1: String,
    iso_code: String/*,
    state_status: {
        type: String,
        enum: ['active', 'in-active']
    },
    ref_country_id: String*/
}, { collection: 'state_master' });

module.exports = mongoose.model('stateMaster', stateMasterSchema);