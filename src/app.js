require('dotenv').config();
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");
const patientAuth = require("./middleware/patientAuth");
const bodyParser = require("body-parser");
const session = require("express-session");
const db = require("./db/conn");
const Register = require("./models/registers");
const Register2 = require("./models/register2");
const Register3 = require("./models/register3");
const { json, response, query } = require("express");
const Test = require('./models/test');
const SymptomsSecond = require('./models/symptom-second');
const Medicine = require('./models/medicine');
const async = require('hbs/lib/async');


const port = process.env.PORT || 3000;
const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(cookieParser());
// app.use(bodyParser.urlencoded({ 
//     extended: true 
// }));
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: "superserect difficult to guess string",
        cookie: {},
        resave: false,
        saveUninitialized: false

    })
)
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path);

global.adminnamelogo = null;
global.usernamelogo = null;


app.get("/", (req, res) => {
    res.render("index");
});


app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    try {
        const registerEmployee = new Register({
            hospital: req.body.hospital,
            doctor: req.body.doctor,
            qualification: req.body.qualification,
            experience: req.body.experience,
            email: req.body.email,
            password: req.body.password
        })

        const token = await registerEmployee.generateAuthToken();

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 30000),
            httpOnly: true
        });

        const registred = await registerEmployee.save();
        res.status(201).render("index");
    }

    catch (error) {
        console.log(error);
        res.sendStatusStatus(400).json(error);
    }
});


app.post("/login", async (req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({ email: email });
        global.adminnamelogo = email;
        const isMatch = await bcrypt.compare(password, useremail.password);
        const token = await useremail.generateAuthToken();
        res.cookie("jwt", token, {
            //expires:new Date(Date.now()+30000),
            httpOnly: true
        });
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        const user = await Register.findOne({ _id: verifyUser._id });
        if (isMatch) {
            res.status(201).render("patientlogin", { name: user.email });
        }
        else {
            res.sendStatus("password incorrect");
        }

    }
    catch (error) {
        res.status(400).send("invalid email");
    }
})

app.get("/login", (req, res) => {
    res.render("login");
});

//patient
var vis;
app.get("/patient", (req, res) => {
    res.render("patient");
});

app.get("/registerpatient", (req, res) => {
    res.render("patient");

});

app.post("/registerpatient", async (req, res) => {
    try {
        const registerPatient = new Register2({
            name: req.body.name,
            sex: req.body.sex,
            dob: req.body.dob,
            contact: req.body.contact,
            maritialstatus: req.body.maritialstatus,
            add1: req.body.add1,
            add2: req.body.add2,
            emergencycontact: req.body.emergencycontact,
            emergencycontactrealtion: req.body.emergencycontactrealtion,
            email: req.body.email,
            password: req.body.password,
            vists: 0
        })
        const token = await registerPatient.generateAuthToken();
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 30000),
            httpOnly: true
        });

        const registred = await registerPatient.save();
        res.status(201).render("index");
    }
    catch (error) {
        res.sendStatus(400).send("error", error);
    }
});
let namep;
app.post("/loginpatient", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const useremail = await Register2.findOne({ email: email });
        const isMatch = await bcrypt.compare(password, useremail.password);
        const token = await useremail.generateAuthToken();

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 70000),
            httpOnly: true
        });
        if (isMatch) {
            res.status(201).render("patientoptions", { adminname: useremail.name, username: useremail.email, visitCount: useremail.visits, admin: false });
        }
        else {
            res.sendStatus("password incorrect");
        }

    }
    catch (error) {
        res.status(400).send("invalid email");
    }
})

app.get("/loginpatient", (req, res) => {
    res.render("patient");
});

app.get("/patientlogin", (req, res) => {
    res.render("patientlogin", { name: adminnamelogo });
});

app.get("/symptoms", auth, async (req, res) => {
    res.render("symptoms");
});

app.get("/patientoptions", auth, async (req, res) => {
    res.render("patientoptions", { adminname: req.email, username: req.query.user, visitCount: req.query.visit, admin: true });
});


app.get("/symptoms2", auth, (req, res) => {
    res.render("symptoms2");
});

app.get("/logout", auth, async (req, res) => {
    try {
        res.clearCookie("jwt");
        await req.user.save();
        res.render("register");
    }
    catch (error) {
        req.status(500).send(error);
    }
});

app.get("/medicines", auth, (req, res) => {
    res.render("medicines");
});

app.get("/tests", auth, (req, res) => {
    res.render("tests");
});

// patien login details
app.post("/checkpatient", auth, async (req, res) => {
    try {
        const email = req.body.email;
        const useremail = await Register2.findOne({ email: email })
        global.usernamelogo = email;
        Register2.update({ "email": email }, { $inc: { "vists": 1 } }, function (err, Register2) {
            if (err) {
                console.warn(err);
            }
        })
        const user1 = await Register2.findOne({ email: email }, { "name": 1, "_id": 0 });
        namep = user1.name;
        // Register2.findOne({email: email}, { projection:{"vists": 1, "_id": 0}}, function(err,Register2){
        //     if(err){
        //         console.warn(err);
        //     }
        //     console.warn(Register2);
        // })
        const user = await Register2.findOne({ email: email }, { "vists": 1, "_id": 0 });
        vis = user.vists;
        // Register2.update({"email":email},{$set: {"vists": 0}}, function(err,Register2){
        //     if(err){
        //         console.warn(err);
        //     }
        //     console.warn(Register2);

        // })
        // Register2.find({"email":email},{"_id":0,"vists":1}, function(err,Register2){
        //     if(err){
        //         console.warn(err);
        //     }
        //     console.warn(Register2);

        // })

        if (await Register2.findOne({ email: email })) {
            vis = user.vists;
            res.status(201).render(`patientoptions`, { adminname: req.email, username: usernamelogo, visitCount: vis, admin: true });
        }
        else {
            res.sendStatus("Invalid email");
        }

    }
    catch (error) {
        res.status(400).send("invalid email");
    }
})

app.get("/checkpatient", auth, (req, res) => {
    res.render("patientoptions", { adminname: req.email, username: usernamelogo, visitCount: "visitC", admin: true });
});

app.get("/medicalhistory", auth, (req, res) => {
    // console.log(req.query);
    res.render("medicalhistory", {admin: true});
});

app.get("/patientHistory", (req, res) => {
    res.render("patienthistory", {admin: false});
});

app.post("/medicalhistory", async (req, res) => {
    try {
        if(req.body.visitNumber > 0) {
            if (req.body.selection === "symptoms") {
                const symptomData = await Register3.find({ patient: req.body.patientName, visitno: req.body.visitNumber }).exec();
                if (symptomData.length === 0 || symptomData === null || symptomData === undefined) {
                    res.json({ data: "Data not found" });
                } else {
                    res.json({ data: symptomData, type: "symptoms" });
                }
            } else if (req.body.selection === "tests") {
                const testData = await Test.find({ patient: req.body.patientName, visitno: req.body.visitNumber }).exec();
                if (testData.length === 0 || testData === null || testData === undefined) {
                    res.json({ data: "Data not found" });
                } else {
                    res.json({ data: testData, type: "tests" });
                }
            } else if (req.body.selection === "symptomsSecond") {
                const symptomsSecondData = await SymptomsSecond.find({ patient: req.body.patientName, visitno: req.body.visitNumber }).exec();
                if (symptomsSecondData.length === 0 || symptomsSecondData === null || symptomsSecondData === undefined) {
                    res.json({ data: "Data not found" });
                } else {
                    res.json({ data: symptomsSecondData, type: "symptomsSecond" });
                }
            } else if (req.body.selection === "medicine") {
                const medicineData = await Medicine.find({ patient: req.body.patientName, visitno: req.body.visitNumber }).exec();
                if (medicineData.length === 0 || medicineData === null || medicineData === undefined) {
                    res.json({ data: "Data not found" });
                } else {
                    res.json({ data: medicineData, type: "medicine" });
                }
            } else {
                res.json({ data: "Data not found" });
            }
        } else {
            if (req.body.selection === "symptoms") {
                const symptomData = await Register3.find({ patient: req.body.patientName}).exec();
                if (symptomData.length === 0 || symptomData === null || symptomData === undefined) {
                    res.json({ data: "Data not found" });
                } else {
                    res.json({ data: symptomData, type: "symptoms" });
                }
            } else if (req.body.selection === "tests") {
                const testData = await Test.find({ patient: req.body.patientName}).exec();
                if (testData.length === 0 || testData === null || testData === undefined) {
                    res.json({ data: "Data not found" });
                } else {
                    res.json({ data: testData, type: "tests" });
                }
            } else if (req.body.selection === "symptomsSecond") {
                const symptomsSecondData = await SymptomsSecond.find({ patient: req.body.patientName}).exec();
                if (symptomsSecondData.length === 0 || symptomsSecondData === null || symptomsSecondData === undefined) {
                    res.json({ data: "Data not found" });
                } else {
                    res.json({ data: symptomsSecondData, type: "symptomsSecond" });
                }
            } else if (req.body.selection === "medicine") {
                const medicineData = await Medicine.find({ patient: req.body.patientName}).exec();
                if (medicineData.length === 0 || medicineData === null || medicineData === undefined) {
                    res.json({ data: "Data not found" });
                } else {
                    res.json({ data: medicineData, type: "medicine" });
                }
            } else {
                res.json({ data: "Data not found" });
            }
        }
    }
    catch (error) {
        res.sendStatus(400);
    }
});

// app.post("/medicalhistory", async (req, res) => {
//     try {
//         if (req.body.selection === "symptoms") {
//             const symptomData = await Register3.findOne({ patient: req.body.patientName, visitno: req.body.visitNumber }).exec();
//             if (symptomData === null || symptomData === undefined) {
//                 res.json({ data: "Data not found" });
//             } else {
//                 res.json({ data: symptomData, type: "symptoms" });
//             }
//         } else if (req.body.selection === "tests") {
//             const testData = await Test.findOne({ patient: req.body.patientName, visitno: req.body.visitNumber }).exec();
//             if (testData === null || testData === undefined) {
//                 res.json({ data: "Data not found" });
//             } else {
//                 res.json({ data: testData, type: "tests" });
//             }
//         } else if (req.body.selection === "symptomsSecond") {
//             const symptomsSecondData = await SymptomsSecond.findOne({ patient: req.body.patientName, visitno: req.body.visitNumber }).exec();
//             if (symptomsSecondData === null || symptomsSecondData === undefined) {
//                 res.json({ data: "Data not found" });
//             } else {
//                 res.json({ data: symptomsSecondData, type: "symptomsSecond" });
//             }
//         } else if (req.body.selection === "medicine") {
//             const medicineData = await Medicine.findOne({ patient: req.body.patientName, visitno: req.body.visitNumber }).exec();
//             if (medicineData === null || medicineData === undefined) {
//                 res.json({ data: "Data not found" });
//             } else {
//                 res.json({ data: medicineData, type: "medicine" });
//             }
//         } else {
//             res.json({ data: "Data not found" });
//         }
//     }
//     catch (error) {
//         res.sendStatus(400);
//     }
// });


app.get("/prescription", auth, (req, res) => {
    res.render("medicines");
});

app.post("/registersymptoms", async (req, res) => {
    try {
        await Register3.create({
            patient: req.body.patient,
            visitno: req.body.visitno,
            symptoms: req.body.symptoms
        });
        res.json({ msg: "success" });
    }
    catch (error) {
        res.sendStatus(400);
    }
});

app.post("/test/create", async (req, res) => {
    try {
        await Test.create({
            patient: req.body.patient,
            visitno: req.body.visitno,
            tests: req.body.tests
        });
        res.json({ msg: "success" });

    } catch (error) {
        res.sendStatus(400);
    }
});

app.post("/symptom/second/create", async (req, res) => {
    try {
        await SymptomsSecond.create({
            patient: req.body.patient,
            visitno: req.body.visitno,
            symptoms: req.body.symptomsSecond
        });
        res.json({ msg: "success" });

    } catch (error) {
        res.sendStatus(400);
    }
});

app.post("/medicine/create", async (req, res) => {
    try {
        await Medicine.create({
            patient: req.body.patient,
            visitno: req.body.visitno,
            medicines: req.body.medicines,
            cured: req.body.cured,
            media: req.body.media,
            notes: req.body.notes,
        });
        res.json({ msg: "success" });

    } catch (error) {
        res.sendStatus(400);
    }
});

app.get("/get/data" , async (req, res) => {
    const data = await Register3.find({});
    res.json(data)
});

app.listen(port, () => {
    db()
    console.log(`server is running at port no ${port}`);
})