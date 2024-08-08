const PROTO_PATH=__dirname + "/proto/user.proto";
const grpc=require("@grpc/grpc-js");
const server=new grpc.Server()

exports.startGrpcServer=function (){
    server.bindAsync("127.0.0.1:50050",
        grpc.ServerCredentials.createInsecure(),
        (err,port) =>{
            if(err) console.log("jgjhvjh",err);
            else{
                server.start();
                console.log(`server running at 127.0.0.1:${port} `);

            } 
            
        }
    )
}

exports.getGrpcServer = function(){
    return server ;
}