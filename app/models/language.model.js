const mongoose = require('mongoose');

const languageMasterSchema  = new mongoose.Schema({
    language_desc: String,
    language_nme: String,
    language_status: {
        type: String,
        enum: ['active', 'in-active']
    }
}, { collection: 'language_master' });

module.exports = mongoose.model('languageMaster', languageMasterSchema);