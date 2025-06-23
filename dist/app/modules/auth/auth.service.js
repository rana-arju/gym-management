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
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../../../shared/database"));
const jwt_1 = require("../../utils/jwt");
const config_1 = __importDefault(require("../../../config"));
exports.authService = {
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield database_1.default.user.findUnique({
                where: { email: data.email },
            });
            if (existingUser) {
                throw new Error("User with this email already exists");
            }
            const hashedPassword = yield bcrypt_1.default.hash(data.password, 12);
            const user = yield database_1.default.user.create({
                data: Object.assign(Object.assign({}, data), { password: hashedPassword }),
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    phone: true,
                    address: true,
                    createdAt: true,
                },
            });
            const token = (0, jwt_1.generateToken)({
                id: user.id,
                email: user.email,
                role: user.role,
            }, config_1.default.jwt.jwtSecret, config_1.default.jwt.jwtExpiration);
            return { user, token };
        });
    },
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield database_1.default.user.findUnique({
                where: { email: data.email },
            });
            if (!user) {
                throw new Error("Invalid email or password");
            }
            const isPasswordValid = yield bcrypt_1.default.compare(data.password, user.password);
            if (!isPasswordValid) {
                throw new Error("Invalid email or password");
            }
            const token = (0, jwt_1.generateToken)({
                id: user.id,
                email: user.email,
                role: user.role,
            }, config_1.default.jwt.jwtSecret, config_1.default.jwt.jwtExpiration);
            const userResponse = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                address: user.address,
            };
            return { user: userResponse, token };
        });
    },
};
