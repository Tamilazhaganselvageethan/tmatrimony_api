const mongoose = require('mongoose');

const higherEducationMasterSchema = new mongoose.Schema({
    highereducation_nme: String,
    highereducation_desc: String,
    highereducation_status: {
        type: String,
        enum: ['active', 'in-active']
    }
}, { collection: 'higherEducation_master' });

module.exports = mongoose.model('higherEducationMaster', higherEducationMasterSchema);