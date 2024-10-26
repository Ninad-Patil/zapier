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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
exports.userRouter = express_1.default.Router();
exports.userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).send("missing emaill and password");
        const user = yield db_1.client.user.findFirst({
            where: { email },
        });
        if (!user)
            return res.status(400).send("no user found");
        const comparePass = yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
        if (!comparePass)
            return res.status(400).send("password doesnt match");
        const secret = process.env.JWT_SEC;
        const token = jsonwebtoken_1.default.sign(user.id, secret);
        return res.status(200).send({ token });
    }
    catch (error) {
        console.log(error);
        res.send(error);
    }
}));
exports.userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).send("missing emaill and password");
        const user = yield db_1.client.user.findFirst({
            where: { email },
        });
        if (user)
            return res.status(200).send("user already exists");
        const encryptedPassword = yield bcrypt_1.default.hash(password, 8);
        yield db_1.client.user.create({
            data: {
                password: encryptedPassword,
                email,
            },
        });
        res.status(200).send("user created successfully");
    }
    catch (error) {
        console.log(error);
        res.send(error);
    }
}));
exports.userRouter.get("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const id = req.id;
        console.log(id, "from user");
        const user = yield db_1.client.user.findFirst({
            where: { id },
            select: { email: true },
        });
        return res.status(200).send(user);
    }
    catch (error) {
        console.log(error);
        res.send(error);
    }
}));
