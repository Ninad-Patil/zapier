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
exports.zapRouter = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const db_1 = require("../db");
exports.zapRouter = express_1.default.Router();
exports.zapRouter.post("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { triggerType, actions } = req.body;
        const zapId = yield db_1.client.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const zap = yield tx.zap.create({
                data: {
                    //@ts-ignore
                    userId: req.id,
                },
            });
            const trigger = yield tx.trigger.create({
                data: {
                    type: triggerType,
                    zapId: zap.id,
                },
            });
            // Map over actions to add sortingOrder based on index
            const formattedActions = actions.map((action, index) => (Object.assign(Object.assign({}, action), { zapId: zap.id, triggerId: trigger.id, sortingOrder: index })));
            yield tx.action.createMany({
                data: formattedActions,
            });
        }));
        res.status(200).send(zapId);
    }
    catch (error) {
        res.send(error);
        console.log(error);
    }
}));
exports.zapRouter.get("/:zapId", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { zapId } = req.params;
        //@ts-ignore
        const userId = req.id;
        const zap = yield db_1.client.zap.findFirst({
            where: {
                id: zapId,
                userId: userId,
            },
            include: {
                Trigger: {
                    select: {
                        type: true, // Only select the `type` field in Trigger
                        action: {
                            select: {
                                type: true, // Only select the `type` field in Action within Trigger
                            },
                        },
                    },
                },
            },
        });
        if (!zap)
            return res.status(404).send("zap not found");
        res.status(200).send(zap);
    }
    catch (error) {
        res.send(error);
        console.log(error);
    }
}));
exports.zapRouter.get("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const id = req.id;
        const zaps = yield db_1.client.zap.findMany({
            where: {
                userId: id,
            },
            include: {
                Trigger: {
                    select: {
                        type: true, // Only select the `type` field in Trigger
                        action: {
                            select: {
                                type: true, // Only select the `type` field in Action within Trigger
                            },
                        },
                    },
                },
            },
        });
        return res.status(200).json({
            zaps,
        });
    }
    catch (error) {
        res.send(error);
        console.log(error);
    }
}));
