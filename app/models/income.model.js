const mongoose = require('mongoose');

const incomeMasterSchema = new mongoose.Schema({
    income_nme: String,
    income_desc: String,
    income_status: {
        type: String,
        enum: ['active', 'in-active']
    }
}, { collection: 'income_master' });

module.exports = mongoose.model('incomeMaster', incomeMasterSchema);