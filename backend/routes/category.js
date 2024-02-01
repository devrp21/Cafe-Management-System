import express, { query } from 'express';
import connection from '../connection.js';
import auth from '../services/authentication.js';
import checkRole from '../services/checkRole.js';


const categoryRouter = express.Router();

categoryRouter.post('/add', auth, checkRole, (req, res, next) => {
    let category = req.body;
    var query = "insert into category (name) value(?)";
    connection.query(query, [category.name], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "Category added successfully" });
        }
        else {
            return res.status(500).json(err);
        }
    });
});


categoryRouter.get('/get', auth, (req, res, next) => {
    var query = "select * from category order by name";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    });
});


categoryRouter.patch('/update', auth, checkRole, (req, res, next) => {
    let product = req.body;
    var query = "update category set name=? where id=?";
    connection.query(query, [product.name, product.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Category id does not found." });
            }
            else {
                return res.status(200).json({ message: "Category updated successfully." });
            }
        }
        else {
            return res.status(500).json(err);
        }
    });
});

export default categoryRouter;