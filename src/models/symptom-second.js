const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const symptomsSecondSchema = new mongoose.Schema({
    patient: {
        type: String,
        required: true
    },
    visitno: {
        type: Number,
        required: true
    },
    symptoms: [
        {
            symptom: {
                type: String,
                required: true
            },
            intensity: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            value: {
                type: String,
                required: true
            },
            unit: {
                type: String,
                required: true
            },
            media: {
                type: String,
            }
        }
    ]

})

const symptomsSecond = new mongoose.model("SymptomsSecondregister", symptomsSecondSchema);
module.exports = symptomsSecond;

// $.post("/registersymptoms", { patient: formData[0].patient, visitno: formData[0].visitno, symptoms: formData[0].symptoms }, function (response) {