import { config } from 'dotenv';
config();

function checkRole(req, res, next) {
    if (res.locals.role == process.env.USER) {
        res.sendStatus(401);
    }
    else {
        next();
    }
}


export default checkRole;