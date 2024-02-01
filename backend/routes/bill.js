import { Router } from "express";
import connection from "../connection.js";
import ejs from 'ejs';
import pdf from 'html-pdf';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import auth from '../services/authentication.js';
// import { nextTick, report } from "process";
import { v1 as uuidv1 } from 'uuid';


const billRouter = Router();


billRouter.post('/generateReport', auth, (req, res) => {
    const generatedUuid = uuidv1();
    const orderDetails = req.body;
    var productDetailsReport = JSON.parse(orderDetails.productDetails);

    var query = "insert into bill (name,uuid,email,contactNumber,paymentMethod,total,productDetails,createdBy) values(?,?,?,?,?,?,?,?)";

    connection.query(query, [orderDetails.name, generatedUuid, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails, res.locals.email], (err, results) => {
        if (!err) {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);

            const templatePath = path.join(__dirname, 'report.ejs');

            ejs.renderFile(templatePath, { productDetails: productDetailsReport, name: orderDetails.name, email: orderDetails.email, contactNumber: orderDetails.email, contactNumber: orderDetails.contactNumber, paymentMethod: orderDetails.paymentMethod, totalAmount: orderDetails.totalAmount }, (err, results) => {
                if (err) {
                    return res.status(500).json(err);
                }
                else {
                    pdf.create(results).toFile('./generated_pdf/' + generatedUuid + ".pdf", function (err, data) {
                        if (err) {
                            console.log(err);
                            return res.status(500).json(err);
                        }
                        else {
                            return res.status(200).json({ uuid: generatedUuid });
                        }
                    });
                }
            });
        }
        else {
            return res.status(500).json(err);
        }
    });
});


billRouter.post('/getPdf', auth, (req, res) => {
    const orderDetails = req.body;
    const pdfPath = './generated_pdf/' + orderDetails.uuid + '.pdf';
    if (fs.existsSync(pdfPath)) {
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res);

    }
    else {
        var productDetailsReport = JSON.parse(orderDetails.productDetails);
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        const templatePath = path.join(__dirname, 'report.ejs');

        ejs.renderFile(templatePath, { productDetails: productDetailsReport, name: orderDetails.name, email: orderDetails.email, contactNumber: orderDetails.email, contactNumber: orderDetails.contactNumber, paymentMethod: orderDetails.paymentMethod, totalAmount: orderDetails.totalAmount }, (err, results) => {
            if (err) {
                return res.status(500).json(err);
            }
            else {
                pdf.create(results).toFile('./generated_pdf/' + orderDetails.uuid + ".pdf", function (err, data) {
                    if (err) {
                        console.log(err);
                        return res.status(500).json(err);
                    }
                    else {
                        res.contentType("application/pdf");
                        fs.createReadStream(pdfPath).pipe(res);
                    }
                });
            }
        });
    }

});


billRouter.get('/getBills', auth, (req, res, next) => {
    var query = "select * from bill order by id DESC";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    });
});

billRouter.delete('/delete/:id',auth,(req,res, next) => {
 const id=req.params.id;
 var query="delete from bill where id=?";
 connection.query(query,[id], (err, results) => {
    if(!err){
        if(results.affectedRows==0){
            return res.status(404).json({message:"Bill id does not found"});
        }
        else{
            return res.status(200).json({message:"Bill deleted successfully"});
        }
    }
    else{
        return res.status(500).json(err);
    }
 });
});


export default billRouter;
