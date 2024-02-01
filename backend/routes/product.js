import Router from 'express';
import connection from '../connection.js';
import auth from '../services/authentication.js';
import checkRole from '../services/checkRole.js';

const productRouter = Router();

productRouter.post('/add', auth, checkRole, (req, res, next) => {
    let product = req.body;
    var query = "insert into product (name,categoryId, description,price, status) values(?,?,?,?,'true')";
    connection.query(query, [product.name, product.categoryId, product.description, product.price], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "Product added successfully" });
        }
        else {
            return res.status(500).json(err);
        }
    });
});


productRouter.get('/get', auth, (req, res, next) => {
    var query = "select p.id,p.name,p.description,p.price,p.status,c.id as categoryId, c.name as categoryName from product AS p INNER JOIN category AS c where p.categoryId = c.id";

    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    });

});

productRouter.get('/getByCategory/:id', auth, (req, res, next) => {
    const id = req.params.id;
    var query = "select id,name from product where categoryId=? and status='true'";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    });
});

productRouter.get('/getById/:id', auth, (req, res, next) => {
    const id = req.params.id;
    var query = "select id, name, description,price from product where id =?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            return res.status(200).json(results[0]);
        }
        else {
            return res.status(500).json(err);
        }
    });
});


productRouter.patch('/update', auth, checkRole, (req, res, next) => {
    let product = req.body;
    var query = "update product set name = ?, categoryId = ?, description = ?, price = ? where id =?";
    connection.query(query, [product.name, product.categoryId, product.description, product.price, product.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "Product id does not found" });
            }
            else {
                return res.status(200).json({ message: "Product Updated successfully" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    });
});


productRouter.delete('/delete/:id', auth, checkRole, (req, res, next) => {
    const id = req.params.id;
    var query = "delete from product where id=?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            if(results.affectedRows==0){
                return res.status(404).json({ message: "Product id does not found" });
            }
            return res.status(200).json({ message: "Product deleted successfully" });
        }
        else {
            return res.status(500).json(err);
        }
    });
});

productRouter.patch('/updateStatus',auth,checkRole,(req,res,next)=>{
    let user=req.body;
    var query="update product set status=? where id=?";
    connection.query(query,[user.status,user.id],(err,results)=>{
        if(!err){
            if(results.affectedRows==0){
                return res.status(404).json({ message: "Product id does not found" });
            }
            return res.status(200).json({ message: "Product Status Updated Successfully" });
        }
        else{
            return res.status(500).json(err);
        }
    });
});


export default productRouter;



