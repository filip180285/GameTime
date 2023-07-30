import express from 'express';
import { SportController } from '../controllers/sport.controller';
const sportRouter = express.Router();

sportRouter.route("/getAllSports").get(
    // verifyTokenMiddleware(["ucesnik", "organizator", "administrator"]),
    (req, res) => new SportController().getAllSports(req, res)
);

sportRouter.route("/getUserPicture").get(
    (req, res) => new SportController().getSportPicture(req, res)
);

export default sportRouter;