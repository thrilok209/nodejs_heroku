const request = require('request');
const express = require('express')
const app = express();
const EventEmitter = require('events');
const emitter = new EventEmitter();
var allNode = 0;
var presentNodes = [];
var presentOnlineNode=[];
var  presentOnlineNodeIndes=[]
var presentOfflineNode=[]
var presentOfflineNodeINdex=[]
var  showofflinenodes=[]
var nodemailer = require('nodemailer');
var sendingmail = true;
var emailerror = 'no error'
var timeCheckvar = 1000*60*process.env.TIMECHECK
var sendingmailkvar = 1000*60*process.env.TIMECHECK

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ID,
    pass: process.env.PASS
  }
});


setImmediate(api)
setInterval(api,timeCheckvar );
setInterval(sendMail,sendingmailkvar);

function sendMail() {
  var mailOptions = {
    from: process.env.ID,
    to: process.env.EID,
    subject: 'Skyminer Nodes check',
    text: 'OFFLINE NODE: ' + presentOfflineNodeINdex.toString()
  };
  if(presentOfflineNodeINdex.length!=0 && sendingmail == true){
    transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
    emailerror = error;
  } else {
    console.log('Email sent: ' + info.response);
  }
});

  }

}


const miner01 = ["032a7513c051c4d2384afca093f86e65888e87645ac0b05b72ca212508b335f8c6",
  "025e9f499126d3af4193c26311fcc75571a18580bb323d89e8113bff45ec14b849",
  "02b19bc5c05f253b6c46b76c09a2553c22c60728f8839640f5d85baa5fc5fa7d2e",
  "03c8f798346a532a37ddc8c50c70f0328e4754c27a2e6b3cd0b61f3b05504e84b0",
  "021ec73e251529dec08d4074c4f99778aff7f0e032300e6e2a911ee7c53737d839",
  "02a3daa62ac22e803190293d19a7394ac13d56ca8db88dd53aa8c1c8bd9bffbba3",
  "037a74c678f8209dc1ade5c865789cac9300398ca5088f7d494d1e4fe834a492fe",
  "025e7ff53fac57eb584ac4c57aef8ec171fc6437adba78dbd1ae32ba07185d65bd"];

emitter.on('data', (arg)=> {
  allNode = []
  allNode = arg;
  // console.log(allNode);

checkOnline();
console.log(timeCheckvar);
console.log(sendingmailkvar);



});



function api() {
  request('http://discovery.skycoin.net:8001/conn/getAll', { json: true }, (err, res, body) => {
    if (err) { return console.log("error in fetching data main data"); }
    console.log(body.length);
    emitter.emit('data', body );

  });
}


function checkOnline()
{
presentOnlineNode=[]
presentOnlineNodeIndes=[]
presentOfflineNodeINdex=[]
presentOfflineNode=[]

for(let i=0;i<allNode.length;i++){
for(let j=0;j<miner01.length;j++){
  if(miner01[j]==allNode[i].key){
    presentOnlineNode.push(miner01[j])

  }
}
}

for(let i=0;i<miner01.length;i++){
var index = presentOnlineNode.indexOf(miner01[i]);

if(index == (-1)) {

presentOfflineNode.push(miner01[i]);
presentOfflineNodeINdex.push(i+1);

}
if(index != (-1)) {

// presentOfflineNode.push(miner01[i]);
presentOnlineNodeIndes.push(i+1);

}

}
console.log(presentOfflineNodeINdex)
// console.log("OK");
// console.log(sendingmail);



}

app.get('/offline', function (req, res) {
  res.send(presentOfflineNodeINdex)
})
app.get('/online', function (req, res) {
  res.send(presentOnlineNodeIndes)
})
app.get('/start', function (req, res) {
  res.send('Turned ON mailing alert!!!')
  sendingmail = true;
})
app.get('/stop', function (req, res) {
  res.send('Turned OFF mailing alert!!!')
  sendingmail = false;

})
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port ${port}`));
