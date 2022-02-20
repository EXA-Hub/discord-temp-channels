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
const BaseCommand_1 = __importDefault(require("../../utils/structures/BaseCommand"));
class TestCommand extends BaseCommand_1.default {
    constructor() {
        super("test", "testing", []);
    }
    run(client, message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            message.channel.send("مرحبا أنا أعمل\n" +
                `
    \x32\x20\x60\x78\x6e\x7a\x9c\x89
    \u00E9\u0065\u0301
    \0 The NUL character (\u0000)
    \b Backspace (\u0008)
    \t Horizontal tab (\u0009)
    \n Newline (\u000A)
    \v Vertical tab (\u000B)
    \f Form feed (\u000C)
    \r Carriage return (\u000D)
    \" Double quote (\u0022)
    \' Apostrophe or single quote (\u0027)
    \\ Backslash (\u005C)
     `);
        });
    }
}
exports.default = TestCommand;
