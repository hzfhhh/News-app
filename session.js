// var express = require('express');
// var RedisStore = require('connect-redis')(express.session);
// var app = express();

// // …Ë÷√ Cookie
// app.use(express.cookieParser('keyboard cat'));

// // …Ë÷√ Session
// app.use(express.session({
//   store: new RedisStore({
//     host: "192.168.108.46",
//     port: 6379,
//     db: "test_session"
//   }),
//   secret: 'keyboard cat'
// }))

// app.get("/", function(req, res) {
//   var session = req.session;
//   session.count = session.count || 0;
//   var n = session.count++;
//   res.send('hello, session id:' + session.id + ' count:' + n);
// });

// app.listen(3002);

// console.log('Web server has started on http://127.0.0.1:3002/');