const Nightmare = require('nightmare')
const fs = require('fs')
const path = require("path")
const nightmare = Nightmare({ show: true }) // Set to false to run headless
const selector = '.W14, .L14'
const decks = [145, 127, 170, 169, 168, 110]

const yyyymmdd = () =>  {
  const twoDigit = n => { 
    return (n < 10 ? '0' : '') + n
  }
  let now = new Date();
  return '' + now.getFullYear() + twoDigit(now.getMonth() + 1) + twoDigit(now.getDate())
}

const today = yyyymmdd()
const baseDir = path.normalize(__dirname + '/data')
const dateDir = path.normalize(baseDir + '/' + today)
const makeDir = (dir) => {
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
}
makeDir(baseDir)
makeDir(dateDir)

const checkDeck = (deck) => {

  let months = ['01', '02', '03' ,'04', '05', '06', '07', '08', '09', '09', '10', '11', '12']

  let now = new Date();

  switch (deck) {
    case 145:
      period = now.getFullYear() + '_' + months[(now.getMonth() - 2)] + '-' + months[now.getMonth()]
      break
    case 127:
      period = now.getFullYear() + '_' + months[(now.getMonth() - 4)] + '-' + months[now.getMonth()]
      break
    case 170:
      period = now.getFullYear()
      break
    case 169:
      period = now.getFullYear() - 1
      break
    case 168:
      period = now.getFullYear() -2
      break
    case 110:
      period = 'All'
      break
    default:
      period = 'All'
  }
  return period
}

const getData = (selector, deck, pageCount, sideboard) => {
    let period = checkDeck(deck)
    let mainDeck = 'MD'
    if (sideboard === true) {
      mainDeck = 'SB'
    }

    let file = path.normalize(dateDir + '/' + period + '_' +  mainDeck + '.txt')
    let url = 'https://mtgtop8.com/topcards?f=PAU&meta=' + deck + '&current_page=' + pageCount + '&maindeck=' + mainDeck

  console.log('Page: ' + pageCount)

  if (selector && deck && pageCount) {
    nightmare
      .goto(url)
      .wait('body')
      .exists('.Nav_PN_no')
      .then((res) => {
        if(res === true && pageCount > 1) {

          if(sideboard === false) {
            console.log('Finished Maindeck.')
            getData(selector, deck, 1, true)
            nextDeck = true
          }
        } else {
          nightmare
            .evaluate(selector => {
                return Array.from(document.querySelectorAll(selector)).map(element => element.innerText)
              }, selector)
            .then( res => {
              let i = 0;
              res.forEach( (res) => {
                i ++
                if ( i % 3 ===  1 ) {
                  console.log(res);
                  fs.appendFile(file, (res + "\r\n"),(err) => {   
                    if (err) throw err
                  })
                }
              })
            })
            .then(() => {
                pageCount++
                getData(selector,deck, pageCount, sideboard)
            })
            .catch(error => {
              console.error('Search failed:', error)
            })
        }
      })
      .catch(error => {
        console.error('Search failed:', error)
      })  
  }  
}
getData(selector, decks[0], 1, false)