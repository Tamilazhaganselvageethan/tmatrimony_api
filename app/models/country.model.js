const mongoose = require('mongoose');

const countryMasterSchema = new mongoose.Schema({
    id: Number,
    country_id:String,
    id_0: Number,
    name_0: String,
    iso_code_2: String,
    iso_code_3: String/*,
    country_status: {
        type: String,
        enum: ['active', 'in-active']
    }*/
}, { collection: 'country_master' });

module.exports = mongoose.model('countryMaster', countryMasterSchema);