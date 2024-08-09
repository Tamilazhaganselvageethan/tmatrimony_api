const mongoose = require('mongoose');

const cmsSchema = new mongoose.Schema({
    sku: String,
    page_title: String,
    page_content: String,
    faq_content: [{
        ques: String,
        ans: String
    }]
}, { collection: 'cms' });

module.exports = mongoose.model('cms', cmsSchema);