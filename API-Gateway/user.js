const express = require("express");
const router = express.Router();
const protoLoader = require("@grpc/proto-loader");
const grpc = require("@grpc/grpc-js");
const proto_path = __dirname + "/protos/user.proto";

const pakageDef = protoLoader.loadSync(proto_path, {});

const UserService = grpc.loadPackageDefinition(pakageDef).UserService;
const client = new UserService(
  "localhost:50050",
  grpc.credentials.createInsecure()
);

router.post("/registeruser", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, msg: "feild are missing in registeer" });
  }

  const CreateUserRequest = {
    user: {
      email,
      username,
      password,
    },
  };

  client.CreateUser(CreateUserRequest, (err, msg) => {
    if (err) {
      console.log(err);
      return res
      .status(500)
      .json({ success: false, msg: "cannot craete user" });
    }else{
        return res
        .status(500)
        .json({ success: true, msg: "user created sucessfully" });
    }
  });
});

router.get("/:id", (req, res) => {
    const { id } = req.params;

    console.log(id);
    
  
    client.getUser({ id }, (err, msg) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, msg: "get user error" });
      } else {
        if (!msg.user)
          return res.status(404).json({ success: true, msg: "user not found" });
        else return res.status(200).json({ success: true, user: msg.user });
      }
    });
  });

  router.post("/login", (req, res) => {
    const { email, password } = req.body;
  
    const createTokenRequest = {
      user: {
        email,
        password,
      },
    };
  
    client.createToken(createTokenRequest, (err, msg) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ success: false, msg: "create token error" });
      } else {
        return res.status(200).json({ success: true, token: msg.token });
      }
    });
  });


module.exports=router