import express from "express";
const router = express.Router();

//Decleration Path and route for any module
const moduleRoutes = [
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
