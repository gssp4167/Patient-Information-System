const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const medicineSchema = new mongoose.Schema({
    patient: {
        type: String,
        required: true
    },
    visitno: {
        type: Number,
        required: true
    },
    cured: {
        type: String,
        required: true
    },
    media: {
        type: String,
    },
    notes: {
        type: String,
    },
    medicines: [
        {
            medicine: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            quantity: {
                type: String,
                required: true
            },
            unit: {
                type: String,
                required: true
            },
            timeDay: {
                type: String,
                required: true
            },
            weekDay: {
                type: String,
                required: true
            },
            days: {
                type: String,
                required: true
            }
        }
    ]

})

const medicine = new mongoose.model("medicine", medicineSchema);
module.exports = medicine;

// $.post("/registersymptoms", { patient: formData[0].patient, visitno: formData[0].visitno, symptoms: formData[0].symptoms }, function (response) {