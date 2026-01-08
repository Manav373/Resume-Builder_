"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resumes_1 = __importDefault(require("./resumes"));
const ai_1 = __importDefault(require("./ai"));
const router = (0, express_1.Router)();
router.get("/health", (req, res) => {
    res.json({ status: "ok" });
});
router.use("/resumes", resumes_1.default);
router.use("/ai", ai_1.default);
exports.default = router;
