const mongoose = require('mongoose');

const educationTypeMasterSchema = new mongoose.Schema({
    educationtype_nme: String,
    educationtype_desc: String,
    educationtype_status: {
        type: String,
        enum: ['active', 'in-active']
    }
}, { collection: 'educationtype_master' });

module.exports = mongoose.model('educationTypeMaster', educationTypeMasterSchema);