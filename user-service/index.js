const {startGrpcServer,getGrpcServer} =require("./grpc");
const protoLoader=require("@grpc/proto-loader");
const grpc=require("@grpc/grpc-js")
const proto_path= __dirname + "/protos/user.proto"
const {CreateUser,createToken,getUser,IsAuthenticated} =require ('./user')

const packageDefinition=protoLoader.loadSync(proto_path,{
    keepCase:true,
    longs:String,
    defaults:true,
    oneofs:true,
})

const user_proto=grpc.loadPackageDefinition(packageDefinition);

startGrpcServer();

const server=getGrpcServer();


server.addService(user_proto.UserService.service,{
    CreateUser,
    createToken,
    getUser,
    IsAuthenticated
})




