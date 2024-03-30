// untuk koneksi database
const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/coba")

// const dalloga = new Contact({
//     nama : "Dalloka",
//     HP: '081673127123',
//     email : 'dalloga@gmail',
//     keyapagt : "ehhehe",
// });


// dalloga.save().then((c)=> console.log(c));