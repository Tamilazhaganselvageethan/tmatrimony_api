const mongoose = require('mongoose');

const hobbiesMasterSchema = new mongoose.Schema({
    hobbies_nme: String,
    hobbies_desc: String,
    hobbies_status: {
        type: String,
        enum: ['active', 'in-active']
    }
}, { collection: 'hobbies_master' });

module.exports = mongoose.model('hobbiesMaster', hobbiesMasterSchema);