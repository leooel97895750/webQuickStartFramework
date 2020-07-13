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

//傳入mailhash, pwdhash，登入帳號，回傳jwt
router.get('/api/login', function(req, res, next) {

    pool.getConnection(function(err, connection){
        if(err) throw err;
        //api參數regex檢查
        const p1 = req.query.mailhash;
        const p2 = req.query.pwdhash;
        if(sqlregex.test(p1) == false && sqlregex.test(p2) == false)
        {
            querystr = "select CID from `member` where Mail_hash='"+p1+"' and Pwd='"+p2+"'";
            connection.query(querystr, function(err, result){
                if(err) throw err;
                if(result[0] == undefined) res.send('fail');
                else
                {
                    const token = jwt.sign({'mycid': result[0].CID}, secret, { expiresIn: '1 day' });
                    res.send(token);
                }
                connection.release();
            })
        }
        else
        {
            res.send('sqlregex fail');
            console.log('sqlregex fail');
        } 
    });
});

module.exports = router;
