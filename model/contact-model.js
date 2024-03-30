// membuat schema

const mongoose = require('mongoose');
const Contact = mongoose.model('Contacts', {
    nama: {
        type: String,
        required: true,
    },
    HP: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
})

module.exports = {Contact}