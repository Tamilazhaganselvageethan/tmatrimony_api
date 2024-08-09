const mongoose = require('mongoose');

const employmentTypeMasterSchema = new mongoose.Schema({
    employment_type_nme: String,
    employment_type_desc: String,
    employment_type_status: {
        type: String,
        enum: ['active', 'in-active']
    }
}, { collection: 'employment_type_master' });

module.exports = mongoose.model('employmentTypeMaster', employmentTypeMasterSchema);