const mongoose = require('mongoose');

const setConnectionStatusSchema = new mongoose.Schema({
    interest_owner_id: {type: mongoose.Schema.Types.ObjectId, ref: 'profileRegistration'},
    selected_profile_id: {type: mongoose.Schema.Types.ObjectId, ref: 'profileRegistration'},
    interest_status: {
        type: String,
        enum: ['Accepted', 'Declined', 'Pending']
    }
}, { collection: 'interest' });

module.exports = mongoose.model('setConnectionStatus', setConnectionStatusSchema);