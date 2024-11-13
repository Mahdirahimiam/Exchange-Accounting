import express from "express";
import { getAllOrders, nobitexLogin } from "../Controllers/nobitexCn.js";

const nobitexRouter = express.Router()
nobitexRouter.route('/').post(nobitexLogin).get(getAllOrders)

export default nobitexRouter