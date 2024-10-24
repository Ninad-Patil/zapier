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
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const client = new client_1.PrismaClient();
app.post("/hooks/catch/:userId/:zapId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, zapId } = req.params;
        const metadata = req.body;
        yield client.$transaction((trx) => __awaiter(void 0, void 0, void 0, function* () {
            const run = yield trx.zapRun.create({
                data: {
                    zapId,
                    metadata,
                },
            });
            yield trx.zapRunOutbox.create({
                data: {
                    zapRunId: run.id,
                },
            });
        }));
        res.status(200).send("okkk");
    }
    catch (error) {
        console.log(error);
    }
}));
app.listen(3000, () => {
    console.log("listening on port 3000");
});
