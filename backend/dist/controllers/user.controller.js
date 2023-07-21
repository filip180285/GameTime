"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_1 = __importDefault(require("../models/user"));
const path = require("path");
const fs = require('fs');
const bcrypt = require('bcrypt');
class UserController {
    constructor() {
        /**
         * Obrada zahteva za prijavu korisnika.
         * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
         * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
         */
        this.login = (req, res) => {
            const username = req.body.username;
            const password = req.body.password;
            user_1.default.findOne({ "username": username, "status": "aktivan" }, (err, user) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.log("1");
                    return res.status(400).json({ "message": "Greska pri prijavi korisnika!" });
                }
                if (!user) {
                    console.log("2");
                    return res.status(400).json({ "message": "Pogrešno korisničko ime ili lozinka!" });
                }
                // provera da li je lozinka ispravna
                const isPasswordMatch = yield bcrypt.compare(password, user.password);
                if (isPasswordMatch == false) {
                    console.log("3");
                    return res.status(400).json({ "message": "Pogrešno korisničko ime ili lozinka!" });
                }
                return res.json(user);
            }));
        };
        /**
        * Obrada zahteva za registraciju korisnika.
        * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
        * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
        */
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const username = req.body.username;
            const user = yield user_1.default.findOne({ "username": username });
            if (user) {
                return res.status(400).json({ "message": "Korisnicko ime je zauzeto!" });
            }
            // id novog korisnika
            let id = 1;
            const users = yield user_1.default.find().sort({ "id": -1 }).limit(1);
            if (users.length > 0) {
                id = users[0].id + 1;
            }
            const name = req.body.name;
            const lastname = req.body.lastname;
            const password = req.body.password;
            const email = req.body.email;
            const type = req.body.type;
            const phone = req.body.phone;
            const subscriptions = [];
            const saltRounds = 10;
            const hashedPassword = yield bcrypt.hash(password, saltRounds);
            const newUser = new user_1.default({
                id: id,
                name: name,
                lastname: lastname,
                username: username,
                password: hashedPassword,
                email: email,
                type: type,
                status: "aktivan",
                phone: phone,
                picture: "",
                subscriptions: subscriptions
            });
            newUser.save().then(user => {
                console.log(user);
                return res.status(200).json({
                    "message": "Uspešno ste se registrovali kao " + type + "!"
                });
            }).catch(err => {
                return res.status(400).json({
                    "message": "Došlo je do greške prilikom slanja zahteva za registraciju!"
                });
            });
        });
        /**
        * Dodavanje i preimenovanje profilne slike za novog korisnika pri registraciji.
        * @param {express.Request} req - Express Request objekat sa prosledjenim parametrima u telu zahteva.
        * @param {express.Response} res - Express Response objekat za slanje odgovora klijentskoj strani.
        */
        this.addPicture = (req, res) => {
            const file = req.file;
            const username = req.body.username;
            if (file) {
                const myArray = file.originalname.split(".");
                const pictureName = username + Date.now() + "." + myArray[myArray.length - 1];
                // preimenovanje dodate slike
                fs.rename(file.path, path.join(__dirname, "../../uploads/users/" + pictureName), (err) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return res.status(400).json({
                            "message": "Greska pri dodavanju slike u bazu!"
                        });
                    }
                    // promena naziva polja picture u kolekciji User
                    yield user_1.default.collection.updateOne({ "username": username }, { $set: { "picture": pictureName } });
                    return res.status(200).json({
                        "message": "Dodata profilna slika u bazu!"
                    });
                }));
            }
            else {
                return res.status(400).json({
                    "message": "Greska pri dodavanju slike u bazu!"
                });
            }
        };
        this.test = (req, res) => __awaiter(this, void 0, void 0, function* () {
            /*const user = await User.find().sort({ id: -1 }).limit(1);
            console.log(user[0].id);
            return res.status(400).json({
                "message": "loseeeee!",
            });*/
            /*return res.status(200).json({
                "message": "oke!",
            });
            res.status(200).json({
                "message": "loseeeee!",
            })*/
            const hashedPassword = yield bcrypt.hash("filip", 10);
            return res.status(200).json({
                "message": "prva!",
                "message2": hashedPassword
            });
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map