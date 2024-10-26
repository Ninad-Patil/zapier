"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = require("./routes/userRoutes");
const zapRoutes_1 = require("./routes/zapRoutes");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/v1/user", userRoutes_1.userRouter);
app.use("/api/v1/zap", zapRoutes_1.zapRouter);
app.listen(8000, () => {
    console.log("listening on port 8000");
});
