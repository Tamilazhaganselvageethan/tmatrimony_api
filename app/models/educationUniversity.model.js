const mongoose = require('mongoose');

const educationUniversityMasterSchema = new mongoose.Schema({
    eduuniversity_nme: String,
    eduuniversity_type: String,
    eduuniversity_status: {
        type: String,
        enum: ['active', 'in-active']
    }
}, { collection: 'eduuniversity_master' });

module.exports = mongoose.model('educationUniversityMaster', educationUniversityMasterSchema);