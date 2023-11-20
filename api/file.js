const fs = require('fs');

const fileHandler = {
  read: async(fn) => {
    const res = await fs.readFileSync(fn, "utf8", (err, data) => { 
      if(err) { console.log(err) }
      return data.toString()
    })
    return new Promise(resolve => { resolve(res) } )
  },
  write: async(name, data) => {
    const res = await fs.writeFileSync(name, data, {flag: 'w+'}, (err) => { 
      if(err) { console.log(err) }
      return true
    })
    return new Promise(resolve => { resolve(res) } )
  },
  readDir: async(fn) => {
    const res = await fs.readdirSync(fn, (err, data) => { 
      if(err) { console.log(err) }
      return data
    })
    return new Promise(resolve => { resolve(res) } )
  },
  readAlt: (fn) => {
    return new Promise(function (resolve, reject) {
      fs.readFile(fn, (err, data) => { 
          if (err) {
              reject(err);
          } else {
              resolve(data);
          }
      });
    });
  },
  writeAlt: (fn) => {
    return new Promise(function (resolve, reject) {
      fs.writeFile('file.txt', 'content\n', function (err) {
          if (err) {
              reject(err);
          } else {
              resolve(true);
          }
      });
    });
  }
}

module.exports = {fileHandler};