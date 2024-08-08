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

exports.createPost = function createPost(call, cb) {
    const { title, description, author, subreddit_id } = call.request.post;
  
    client.query(
      "insert into posts(title, description, subreddit_id, author) values($1, $2, $3, $4) returning id",
      [title, description, subreddit_id, author],
      (err, res) => {
        if (err) {
          return cb(err, null);
        } else {
          const response = {
            id: res.rows[0].id,
          };
          return cb(null, response);
        }
      }
    );
  };

//   exports.getPosts=function getPosts(call,cb) {
//     const {id} =call.request
//     const query="select "
//     client.query(

//     )
//   }