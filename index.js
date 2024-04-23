const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
// const morgan = require('morgan');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// app.use(morgan{'dev'});
app.use((req, res, next) =>{
    console.log(`${new Date().toISOString()} - ${req.method} request to ${req.originalUrl}`);
    next();
});
// connection o our database
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'accountsuser',
    password: 'password',
    database: 'accountsdb'
});

// helper for finding an existing email
const emailExists = (email, callback) => {
    pool.query('SELECT * FROM accounts_customuser where email = ?',[email], (error, results, fields) =>{
        if (error) return callback(error);
        return callback(null, results.length >0);
    });
};

// Registering API
app.post('/signup', async (req, res) => {
    const {email, username, password} = req.body;
    emailExists(email, (err, exists) => {
        if (err){
            return res.status(500).send('Error checkig user exixtence, with error: '+ err);
        }
        if (exists){
            return res.status(409).send('Email already taken, please use another!!!');
        }
        // store the user details in the pool
        pool.query('INSERT INTO accounts_customuser (email, username, password) VALUES (?,?,?)', [email, username, password], (error, results, fields) =>{
            if (error){
                return res.status(500).send('Failed to register user');
            }
            res.status(201).send('User registered!!!');
        });
    });
});

// Login API
app.post('/login', async (req, res) =>{
    const {username, password}  = req.body;
    pool.query('SELECT * FROM accounts_customuser WHERE username = ? and password = ?', [username, password], (error, results, fileds) => {
        
        if (error){
            return res.status(500).send('Error during login');
        }
        if (results.length>0){
            const user = results[0];
            const token = jwt.sign({username: user.username}, 'secret', {expiresIn: '2h'});
            res.json({ 
                message: 'Login Successful :)',
                token: token });
        } else {
            res.status(401).send('Invalid credentials, Please try again!!!')
        }
    });
});

app.listen(PORT, ()=>{
    // console.log(PORT)
    console.log('Server running on http://localhost:'+PORT);
});