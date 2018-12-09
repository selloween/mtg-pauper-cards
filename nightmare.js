const Nightmare = require('nightmare')
const fs = require('fs')
const path = require("path")
const nightmare = Nightmare({ show: true })
const selector = '.W14, .L14'
const timeFrame = '110'

const getData = (selector, timeFrame, pageCount, sideboard) => {

  let fileName = '/mainboard.txt'
  let url = 'https://mtgtop8.com/topcards?f=PAU&meta=' + timeFrame + '&current_page=' + pageCount

  if (sideboard === true) {
    fileName =  '/sideboard.txt'
    url = 'https://mtgtop8.com/topcards?f=PAU&meta=' + timeFrame + '&current_page=' + pageCount + '&maindeck=SB'
  }

  let filePath = path.normalize(__dirname + fileName)

  console.log(pageCount)

  if (selector && timeFrame && pageCount) {
    nightmare
      .goto(url)
      .exists('.Nav_PN_no')
      .then((res) => {
        if(res === true && pageCount > 1) {
          if(sideboard === false) {
            console.log('Finished Maindeck.')
            getData(selector, timeFrame, 1, true)
          }
        } else {
          nightmare
            .evaluate(selector => {
                return Array.from(document.querySelectorAll(selector)).map(element => element.innerText)
              }, selector)
            .then( results => {
              let i = 0;
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
                pageCount++
                getData(selector, timeFrame, pageCount, sideboard)
            })
            .catch(error => {
              console.error('Search failed:', error)
            })
        }
      })  
  }
}
getData(selector, timeFrame, 1, false)
