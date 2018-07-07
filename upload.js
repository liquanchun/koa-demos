const os = require('os');
const path = require('path');
const Koa = require('koa');
const fs = require('fs');
const uuid = require('node-uuid'); 
const koaBody = require('koa-body');
var cors = require('koa2-cors');

const app = new Koa();

const main = async function(ctx) {
  const tmpdir = 'F:\\hotel-app-api2\\Hotel.App.API2\\wwwroot\\upload';
  const filePaths = [];
  const files = ctx.request.body.files || {};

  for (let key in files) {
    const file = files[key];
    const fileName = uuid.v1() + path.extname(file.name);
    const filePath = path.join(tmpdir, fileName);
    
    const reader = fs.createReadStream(file.path);
    const writer = fs.createWriteStream(filePath);
    console.log(`文件路径：${filePath}`);
    reader.pipe(writer);
    filePaths.push(fileName);
  }

  ctx.body = filePaths;
};

app.use(cors({
  origin: function (ctx) {
      if (ctx.url === '/test') {
          return "*";
      }
      return 'http://localhost:4200';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

app.use(koaBody({ multipart: true }));
app.use(main);
app.listen(3000);
