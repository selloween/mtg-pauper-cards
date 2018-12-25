# mtg-pauper-cards

This script will download card lists of the current and past meta of top 8 Magic the Gathering Pauper decks played in tournaments.
The data is crawled from [mtgtop8](https://www.mtgtop8.com) using [nightmare JS](https://github.com/segmentio/nightmare). Nightmare is a high-level browser automation library.

## Requirements

* [Node.js](https://nodejs.org/en/)
(Tested on v10.13.0)

## Installation

In the root directory:

```
npm install
```

## Configuration

The script will by default download seperate lists of mainboard and sideboard cards played in top decks of follwing time periods:

* Last 2 months
* Last 4 months
* Current year
* Last year
* 2 years ago
* All cards since the beginnig of time

You can adjust the time periods by removing number codes in the object decks array value ```decks: [145, 127, 170, 169, 168, 110]``` passed  in the intial getData() function call.
Note: Do not set sideboard the sideboard value to true in the initial getData() call. The sideboard value is set to true after mainboard lists are downloaded. See code bellow.

```
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
```

## Run the script

```
node nightmare.js
```


### TODO:
* Download card images from scryfall.com
