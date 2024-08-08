const express = require("express");
const router = express.Router();
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");

const proto_path = __dirname + "/protos/user.proto";

const pakageDef = protoLoader.loadSync(proto_path, {});

const UserService = grpc.loadPackageDefinition(pakageDef).UserService;
const client = new UserService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

router.post("/addPost",(req,res)=>{
    const { title, description, subreddit_id } = req.body;

    const createPostRequest = {
        post: {
          title,
          description,
          subreddit_id,
          author: req.user.id,
        },
      };
      client.createPost(createPostRequest, (err, msg) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, msg: "create post error" });
        } else {
          return res
            .status(200)
            .json({ success: true, msg: "post created", id: msg.id });
        }
      });
})