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

//測試用
router.get('/api/getdata', function(req, res, next) {

    jwt.verify(req.headers['token'], secret, function(err, decoded){
        if(err) res.send('authDenied');
        else
        {
            console.log(decoded);
            pool.getConnection(function(err, connection){
                if(err) throw err;
                querystr = "select * from test_table";
                connection.query(querystr, function(err, result){
                    if(err) throw err;
                    res.send(result);
                    connection.release();
                })
            });
        }
    });
});

module.exports = router;

