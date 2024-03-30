const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

const { body, check, validationResult } = require('express-validator');
const methodOverride = require('method-override');
require('./utils/db')
const { Contact } = require('./model/contact-model')

const app = express();
const port = 3000;

app.use(methodOverride('_method'));

app.listen(port, () => {
    console.log(`mongo contact app | at http://localhost:${port}`);
})

app.set("view engine", "ejs");
app.use(expressLayouts);

app.use(express.static('public'))

app.use(express.urlencoded())

app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,

}));

app.use(flash());

app.get("/", (req, res) => {

    const mhs = [
        {
            nama: "loka",
            nrp: "3123550001",
        },
        {
            nama: "dharma",
            nrp: "3123550009",
        },
    ];
    res.render("index", {
        layout: 'layouts/main-layout.ejs',
        nama: "loka",
        title: "home page",
        mhs: mhs,
    });
    // cara biasa hanya mengirimkan string
    // res.send('halo')

    // mengembalikan json
    // res.json({
    //   nama: "talloka",
    //   HP: "08123456778",
    //   email:"veryuas@gmail.com"
    // });

    // mengembalikan sebuah file.
    // harus menyertakan root directory filenya selain lokasi filenya.
    // res.sendFile("./index.html", { root: __dirname });
});

app.get("/about", (req, res) => {

    res.render("about",
        {
            title: "about",
            layout: 'layouts/main-layout.ejs',
        });
});

app.get("/contacts", async (req, res) => {
    res.render("contacts",
        {
            title: "contacts",
            layout: 'layouts/main-layout.ejs',
            contacts: await Contact.find(),
            msg: req.flash('msg')
        });
});
app.get("/contacts/add", (req, res) => {
    res.render("formContact",
        {
            title: "form contact",
            layout: 'layouts/main-layout.ejs',
        });
});

app.post("/contacts", [
    body('nama').custom(async (value) => {
        const dupe = await Contact.findOne({ nama: value });

        if (dupe) {
            throw new Error('nama sudah adha!')
        }

        return true;
    }),
    check('email', 'email macam apa itu?').isEmail(),
    check('HP', 'kamu bukan orang indo! hush hush').isMobilePhone('id-ID'),

], (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.render("formContact", {
            title: "form contact",
            layout: 'layouts/main-layout.ejs',
            errors: result.array()
        });
    } else {
        Contact.insertMany(req.body)
        req.flash('msg', 'successfully saved yay!')
        res.redirect("/contacts")
    }
});

app.get("/contacts/:nama", async (req, res) => {
    res.render("detail",
        {
            title: "detail contact",
            layout: 'layouts/main-layout.ejs',
            contact: await Contact.findOne({ nama: req.params.nama })
        });
});

app.delete("/contacts", (req, res) => {
    Contact.deleteOne({ nama: req.body.nama }).then((result) => {
        req.flash('msg', 'successfully deleted yay!')
        res.redirect("/contacts")
    });
    // const contact = await Contact.findOne({ nama: req.params.nama });

    // if (!contact) {
    //     res.status(404)
    //     res.send('<h1>404</h1>')
    // } else {
    //     contact.deleteOne({ _id: contact._id }).then((result) => {
    //         req.flash('msg', 'successfully deleted yay!')
    //         res.redirect("/contacts")
    //     });
    // }
})

app.use("/", (req, res) => {
    res.status(404);
    res.send("page not not found!");
});

