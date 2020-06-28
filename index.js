let http = require('http');
const express = require('express');
const app = express();
let cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require("dotenv-safe").config();
let jwt = require('jsonwebtoken');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', (req,res, next) => {
    res.json({message: "Tudo OK!"});
})


app.get('/clientes', verifyJWT, (req, res,next) => {
    console.log("Retornou todos os Clientes!");
    res.json([{id:1,nome:'claudio'}]);
})


app.post('/login', (req, res, next)=>{
    // esse teste a seguir deve ser feito no Banco de Dados 
    if(req.body.user === 'claudio' && req.body.pwd === '123'){
        // Auth OK
        const  id = 1; // in a real world it comes from database
        let token = jwt.sign({id},process.env.SECRET,{
            expiresIn: 300 // expira em 5 minutos
        });
        return res.json({auth:true, token: token});
    }
    res.status(500).json({message:'Login inválido!'});
})

app.post('logout',function(req,res){
    res.json({auth:false,token:null});
})

function verifyJWT(req, res, next){
    let token = req.headers['x-access-token'];
    if(!token) return res.status(401).json({auth:false,message:'No Token Provided.'});
    //se não existir ja gerar um erro logo de cara
    jwt.verify(token,process.env.SECRET, function(err, decoded){
        if(err) return res.status(500).json({auth:false,message:'Failed to authenticate token.'});

        // se estiver ok, salva no resquest para uso posterior
        req.userId = decoded.id;
        next();
    })
}


let server = http.createServer(app);
server.listen(3000);
console.log("Servidor excutando na porta 3000");