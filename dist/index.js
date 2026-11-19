"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = Number(process.env.PORT ?? 8000);
const host = process.env.HOST ?? '127.0.0.1';
app.get('/', (req, res) => {
    res.send('Hello from Babylone, Corentin and Aurora!');
});
app.listen(port, host, () => {
    console.log(`listening on http://${host}:${port}`);
});
