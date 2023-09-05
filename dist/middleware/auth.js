"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../model/userModel");
const jwt_secret = process.env.JWT_TOKEN;
// export const auth = async(req:Request | any, res:Response, next:NextFunction) => {
//     try {
//         // const authorization = req.headers.authorization;
//         const authorization = req.cookies.token
//         if (!authorization) {
//           return res.status(401).json({
//             Error: "Kindly login",
//           });
//         }
//         // const token = authorization?.slice(7, authorization.length);
//         const verified = Jwt.verify(authorization, jwt_secret);
//         if (!verified) {
//           return res.status(401).json({
//             Error: "Invalid access, kindly upgrade",
//           });
//         }
//         const { id } = verified as { [key: string]: string };
//         const user = await User.findOne({
//           where: { id: id },
//         });
//         if (!user) {
//           return res.status(401).json({
//             Error: "User not found, kindly register",
//           });
//         }
//         req.user = verified;
//         next();
//     } catch (error) {
//         console.log(error);
//         return res.status(401).json({ Error : "unauthorized" });
//     }
// }
/**=======================FOR EJS =================== */
const auth = async (req, res, next) => {
    try {
        // const authorization = req.headers.authorization;
        const authorization = req.cookies.token;
        if (!authorization) {
            return res.redirect('/login');
        }
        // const token = authorization?.slice(7, authorization.length);
        const verified = jsonwebtoken_1.default.verify(authorization, jwt_secret);
        if (!verified) {
            return res.redirect("/login");
        }
        const { id } = verified;
        const user = await userModel_1.User.findOne({
            where: { id: id },
        });
        if (!user) {
            return res.status(401).json({
                Error: "User not found, kindly register",
            });
        }
        req.user = verified;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ Error: "unauthorized" });
    }
};
exports.auth = auth;
