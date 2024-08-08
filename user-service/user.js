const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Client } = require("pg");
// const { Client } = require("@grpc/grpc-js");

const clientConfig = {
    user: "postgres",
    password: "8590183325",  
    database: "backend_grpc",
    host: "localhost",  
    port: 5432,  
  }

const client = new Client(clientConfig);
client.connect();
exports.CreateUser = function CreateUser(call, cb) {
  const { username, email, password } = call.request.user;
  console.log(username,email,password);
  

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return cb(null, err);

    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        console.log("err");
        
        cb(null, err);
      }

      client.query(
        "insert into users (username,email,password) values($1,$2,$3)",
        [username, email, hash],
        (err, res) => {
          if (err) {
            console.log("error");
            console.log(err)
            return cb(err, null);
          }

          const response = {
            id: res.rows[0],
          };

          return cb(null, response);
        }
      );
    });
  });
};

exports.getUser = function getUsers(call, cb) {
  const { id } = call.request;

  client.query(
    "select username,email from users where id=$1",
    [id],
    (err, res) => {
      if ("getUser",err) return cb(err, null);

      if (res.rows.length === 0) return cb(new Error("user not found"), null);

      const response = {
        user: {
          username: res.rows[0].username,
          email: res.rows[0].email,
          id,
        },
      };

      return cb(null, response);
    }
  );
};

exports.createToken=function createToken(call,cb){
    let user=call.request.user
   let query="select id,username from users where email=$1"
    client.query(
        query,
        [user.email],
        (err,res)=>{
            if("createToken",err) return cb(err,null)
                bcrypt.compare(user.password,res.rows[0].username,(err,ok)=>{
                    if(err){
                        console.log("skfvdhakdjfbvj");
                        
                        return cb(err,null)
                    };

                    if (ok) {
                        user.id = res.rows[0].id;
                        user.username = res.rows[0].username;
                        jwt.sign(user, "SECRET", (err, token) => {
                          if (err) return cb(err, null);
                          const response = {
                            token,
                          };
                          return cb(null, response);
                        });
                      }
                      if (!ok) {
                        console.log("fvskjdfvj");
                        
                        return cb(new Error("incorrect password"), null);
                      }

                       
                })
        }
    )
};

exports.IsAuthenticated= function IsAuthenticated(call,cb){
    const token = call.request.token;

    jwt.verify(token, "SECRET", (err, user) => {
      if (err) return cb(err, { ok: false });
      else {
        const response = {
          ok: true,
          user: user,
        };
        return cb(null, response);
      }
    });
}