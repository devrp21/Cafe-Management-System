import connection from '../connection.js';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import nodemailer from 'nodemailer';
import auth from '../services/authentication.js';
import checkRole from '../services/checkRole.js';

config();

const userRouter = Router();
let query;

userRouter.post('/signup', (req, res) => {
    let user = req.body;
    query = "select email, password, role, status from user where email=?";
    connection.query(query, [user.email], (err, result) => {
        if (!err) {
            if (result.length <= 0) {
                query = "insert into user(name,contactNumber,email,password,status,role) values (?,?,?,?,'false','user')";
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, result) => {
                    if (!err) {
                        return res.status(200).json({ message: "Sucessfully Registered" })
                    }
                    else {
                        return res.status(500).json(err);
                    }
                });
            }
            else {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })

});


userRouter.post('/login', (req, res) => {
    const user = req.body;
    query = "select email, password, role, status from user where email=?";
    connection.query(query, [user.email], (err, result) => {
        // console.log(result);
        if (!err) {
            if (result.length <= 0 || result[0].password != user.password) {
                return res.status(401).json({ message: "Incorrect username or password" });
            }
            else if (result[0].status === 'false') {
                return res.status(401).json({ message: "Wait for Admin Approval" });
            }
            else if (result[0].password == user.password) {
                const response = { email: result[0].email, role: result[0].role };
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
                res.status(200).json({ token: accessToken });
            }
            else {
                return res.status(400).json({ message: "Something went wrong please try again later" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    });
});


var transport = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});


userRouter.post('/forgotpassword', (req, res) => {
    const user = req.body;
    query = "select email,password from  user where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(200).json({ message: "Password sent successfully to your email." });
            }
            else {
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: "Password by CafeManagement System",
                    html: `<p><b>Your Login Details for Cafe Management System</b><br> <b>Email:</b>${results[0].email}<br><b>Password: </b>${results[0].password}<br> <a href="http://localhost:4200/user/login">Click here to login</a></p>`
                };
                transport.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                return res.status(200).json({ message: "Password sent successfully to your email." });
            }
        }
        else {
            return results.status(300).json(err);
        }
    });
});


userRouter.get('/get', auth, checkRole, (req, res) => {
    query = "select id,name,email,contactNumber,status from user where role='user'";
    connection.query(query, (err, result) => {
        if (!err) {
            return res.status(200).json(result);
        }
        else {
            return res.status(500).json(err);
        }
    })
});


userRouter.patch('/update', auth, checkRole, (req, res) => {
    let user = req.body;
    query = "UPDATE user SET status=? where id=?";
    connection.query(query,[user.status, user.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "User id does not exist." });
            }
            return res.status(200).json({ message: "User Updated Successfully." });
        }
        else {
            return res.status(500).json(err);
        }
    });
});

userRouter.get('/checkToken', auth, (req, res) => {
    return res.status(200).json({ message: "true" });
});

userRouter.post('/changePassword',auth, (req, res) => {
    const user = req.body;
    const email = res.locals.email;
    query = "select * from user where email=? and password=?";
    connection.query(query, [email, user.oldPassword], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(400).json({ message: "Incorrect Old Password" });
            }
            else if (results[0].password == user.oldPassword) {
                query = "update user set password=? where email=?";
                connection.query(query, [user.newPassword, email], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Password Updated successfully" });

                    }
                    else {
                        return res.status(500).json(err);
                    }
                });
            }
            else {
                return res.status(400).json({ message: "Something went wrong please try again" });
            }
        }
        else {
            return res.status(500).json(err);
        }
    });

});

export default userRouter;