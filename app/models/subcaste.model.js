const mongoose = require('mongoose');

const subcasteMasterSchema = new mongoose.Schema({
    subcaste_nme: String,
    subcaste_desc: String,
    subcaste_status: {
        type: String,
        enum: ['active', 'in-active']
    }
}, { collection: 'subcaste_master' });

module.exports = mongoose.model('subcasteMaster', subcasteMasterSchema);