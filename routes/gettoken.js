require('dotenv').config();
let mysql = require('mysql');
let pool = mysql.createPool({
  host : process.env.HOST,
  user : process.env.USER,
  password : process.env.PASSWORD,
  database : process.env.DATABASE
});
let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');
const secret = process.env.SECRET;
const sqlregex = /[;-\s\n\b'/"!`#}!{$&})(=+*|]/;

//登入帳號並給予jwt
router.get('/api/gettoken', function(req, res, next) {

    pool.getConnection(function(err, connection){
        if(err) throw err;
        querystr = "insert into test_table(CName) values('"+req.query.name+"')";
        connection.query(querystr, function(err, result){
            if(err) throw err;
            const token = jwt.sign({}, secret, { expiresIn: '1 day' });
            res.send(token);
            connection.release();
        })
    });
});

module.exports = router;

