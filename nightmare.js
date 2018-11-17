const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })
const fs = require('fs');
const path = require("path");

//const selector = '.L14 , .W14'
const filePath = path.normalize(__dirname + "/data.txt");

const writeFile = (filePath, input) => {
  return new Promise((resolve, reject ) => {

    fs.appendFile(filePath, (result + "\r\n"),(err) => {
      if (err) throw err

      resolve(console.log('Saved!'));
    })

  });
}
const getData = (selector, period, count) => {

  console.log(count)

  nightmare
    .goto('https://mtgtop8.com/topcards?f=PAU&meta=' + period + '&current_page=' + count + '&maindeck=SB')
    .evaluate(selector => {
        return Array.from(document.querySelectorAll(selector)).map(element => element.innerText);
      }, selector)
    .then( results => {

      let i = 0;
      //let seperator = ",";

      results.forEach( (result) => {
        i ++

        if ( i % 3 ===  1 ) {
          console.log(result);

          fs.appendFile(filePath, (result + "\r\n"),(err) => {   
            if (err) throw err
          })

        }
   
      })
    })
    .then(() => {
      console.log(count)
      if(count <= 49) {
        console.log('click')
        count++
        getData('.W14, .L14', '110', count)
      }
    })
    .catch(error => {
      console.error('Search failed:', error)
    })
} 

getData('.W14, .L14', '110', 1);