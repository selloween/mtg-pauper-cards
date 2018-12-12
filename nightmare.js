const Nightmare = require('nightmare')
const fs = require('fs')
const path = require("path")
const nightmare = Nightmare({ show: true }) // Set show option to true to open a electron browser. Good for testing.

/* Returns the current Year */
const yyyymmdd = () =>  {
  const twoDigit = n => { 
    return (n < 10 ? '0' : '') + n
  }
  let now = new Date();
  return '' + now.getFullYear() + twoDigit(now.getMonth() + 1) + twoDigit(now.getDate())
}
const today = yyyymmdd()

/* Create data directories */
const baseDir = path.normalize(__dirname + '/data')
const dateDir = path.normalize(baseDir + '/' + today)
const makeDir = (dir) => {
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
}
makeDir(baseDir)
makeDir(dateDir)

/* Checks selected meta period and returns human readable string for prefixing filenames */
const checkDeck = (deck) => {

  let months = ['Jan', 'Feb', 'Mar' ,'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  let now = new Date();

  switch (deck) {
    case 145:
      prefix = now.getFullYear() + '_' + months[(now.getMonth() - 1)] + '-' + months[now.getMonth()]
      break
    case 127:
      prefix = now.getFullYear() + '_' + months[(now.getMonth() - 2)] + '-' + months[now.getMonth()]
      break
    case 170:
      prefix = now.getFullYear()
      break
    case 169:
      prefix = 'All_' + now.getFullYear() - 1
      break
    case 168:
      prefix ='All_' + now.getFullYear() -2
      break
    case 110:
      prefix = 'All'
      break
    default:
      prefix = 'All'
  }
  return prefix
}

/* Main function starting Nightmare and fetching and writing card data */
const getData = (args) => {

    let selector = args.selector
    let page = args.page
    let count = args.count
    let sideboard = args.sideboard
    let decks = args.decks
    let deck = args.decks[count]

    let prefix = checkDeck(deck)
    let mainDeck = 'MD'

    if (sideboard === true) {
      mainDeck = 'SB'
    }
    
    let file = path.normalize(dateDir + '/' + prefix + '_' +  mainDeck + '.txt')
    let url = 'https://mtgtop8.com/topcards?f=PAU&meta=' + deck + '&current_page=' + page + '&maindeck=' + mainDeck


  if (selector && deck && page) {
    nightmare
      .goto(url)
      .wait('body')
      .exists('.Nav_PN_no')
      .then((res) => {
        if(res === true && page > 1) {
          if(sideboard === false) {
            console.log('Finished Maindeck.')
            getData({
              selector: selector,
              decks: decks,
              page: 1,
              count: count,
              sideboard: true
            })
          }
          else if(sideboard === true){
            console.log('Finished Sideboard.')
            count++
            getData({
              selector: selector,
              decks: decks,
              page: 1,
              count: count,
              sideboard: false
            })
          }
        } else {
          nightmare
            .evaluate(selector => {
                return Array.from(document.querySelectorAll(selector)).map(element => element.innerText)
              }, selector)
            .then( (res) => {
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
                page++
                console.log('########### Page: ' + page + '###########')
                getData({
                  selector: selector,
                  decks: decks,
                  page: page,
                  count: count,
                  sideboard: sideboard
                })
            })
            .end()
            .then(console.log('########### Finished ###########'))
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

getData({
  selector: '.W14, .L14', // html class selectors containing card data
  /* Codes for filtering different meta periods
    145: Last 2 Months,
    127: Last 4 Months,
    170: Current Year,
    169: Last Year, 
    168: 2 years ago
    110: All cards from all decks
  */
  decks: [145, 127, 170, 169, 168, 110], 
  page: 1,
  count: 0,
  sideboard: false
})