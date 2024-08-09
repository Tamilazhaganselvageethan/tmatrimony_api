const mongoose = require('mongoose');

const educationInstitutionMasterSchema = new mongoose.Schema({
    eduinstitution_nme: String,
    eduuniversity_nme: String,
    eduinstitution_status: {
        type: String,
        enum: ['active', 'in-active']
    }
}, { collection: 'eduinstitution_master' });

module.exports = mongoose.model('educationInstitutionMaster', educationInstitutionMasterSchema);