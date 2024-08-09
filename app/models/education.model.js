const mongoose = require('mongoose');

const educationMasterSchema = new mongoose.Schema({
    education_nme: String,
    education_desc: String,
    education_type: String,
    caste_status: {
        type: String,
        enum: ['active', 'in-active']
    }
}, { collection: 'education_master' });

module.exports = mongoose.model('educationMaster', educationMasterSchema);