const mongoose = require("mongoose");
const TestSchema = new mongoose.Schema({
    patient: {
        type: String,
        required: true
    },
    visitno: {
        type: Number,
        required: true
    },
    tests: [
        {
            test: {
                type: String,
                required: true
            },
            media: {
                type: String
            }
        }
    ]

})

const test = new mongoose.model("TestRegister", TestSchema);
module.exports = test;
