const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser')
const fs = require('fs')
//const readline = require('readline')
const conf = require('config')
const multer = require('multer')
const {exec} = require('child_process')

app.listen(conf.port, () => {
  console.log('Running at Port '+conf.port+'...');
});

// 静的ファイルのルーティング
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let path = 'tmp/' + getNowDateTime()+'/';
        fs.mkdirSync(path);
        cb(null, path);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
  
// const upload = multer({ dest: 'public/uploads/' })
const upload = multer({ storage: storage });

app.post('/upload', upload.array('file'), (req, res) => {
    const content1 = fs.readFileSync(req.files[0].path, 'utf-8');
//    const content2 = fs.readFileSync(req.files[1].path, 'utf-8');
//    res.send(content1+content2);
    console.log(content1);

    exec('sh ./external/sample.sh', (err,stdout,stderr) => {
        if(err){
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`)
    })

    res.send(content1);
});

const getNowDateTime = () => {
    const date = new Date();
    const Y = date.getFullYear();
    const M = ("00" + (date.getMonth()+1)).slice(-2);
    const D = ("00" + date.getDate()).slice(-2);
    const h = ("00" + date.getHours()).slice(-2);
    const m = ("00" + date.getMinutes()).slice(-2);
    const s = ("00" + date.getSeconds()).slice(-2);
    const sss = ("000" + date.getMilliseconds()).slice(-3);
  
    return Y + M + D + h + m + s + sss
  }