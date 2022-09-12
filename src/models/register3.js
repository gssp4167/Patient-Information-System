const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const symptomsSchema = new mongoose.Schema({
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
            }
        }
    ]

})

const Register3 = new mongoose.model("Symptomsregister", symptomsSchema);
module.exports = Register3;

// $.post("/registersymptoms", { patient: formData[0].patient, visitno: formData[0].visitno, symptoms: formData[0].symptoms }, function (response) {