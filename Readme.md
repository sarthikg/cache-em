# Cache-em
Autocomplete Input Forms or Drop Down Menu's with data to be served from a SQL Database are a pain to implement. This is for 3 mains reasons:
1. Securing Data by limiting only suggested data on the frontend.
2. Reduce the number of queries to the Database.
3. Data for forms is dynamic in nature fetched directly from the database, rather that being hard coded on the frontend or the backend.

## Installation
Installation is done using npm install command:
```
$ npm install cache-em
```

## Introduction
Cache-em looks forward to solve all the 3 problems with a single method. Specify your SQL Query, Reload Time, and you are good to go with the cached data each and every time.

## Usage
This package comes with a single method to fast-forward the needs of most of the developers out there. More methods will soon be incorporated to help in certain specific cases.

### Declaring Cache Query
After importing, you should first declare the cache query. Declaring a cache query is just about storing a SQL Query against which you require cache to be stored on the backend. While specifying this query, you also specify the time interval after which you want the cache to be updated from the database.
Here is an example on how to use it:

``` javascript
var cachem = require('cache-em')
var mysql = require('mysql')

var pool = mysql.createPool({
    connectionLimit: '10',
    host: 'localhost',
    user: 'me',
    password: 'secret',
    database: 'my_db'
})

var cached_states = cachem(pool, 1000, 'SELECT id, stateName from States')
```
Here, the first parameter is the SQL Pool which should be used for obtaining a connection to execute the query. Pass the time (ms) for auto-refreshing the data in the cache object, and lastly pass the query itself.

### Fetching Results
Fetching the results is as easy as using fetch method. Fetch method returns a promise, which will resolve with the data against the declared query.
If the data is fetched while the data hasn't expired, there will be no new query to the database, and you will receive the results from the cache, but if the data is requested after it has expired, fetch method will automatically query the database, replace the old cache, and return the results back to you!
 ``` javascript
 let data_states = await cached_states.fetch()
 ```

## Example
And here we present you with a working example, to help you fast-forward with the relatively small documentation ;)
``` javascript
var cachem = require('cache-em')
var mysql = require('mysql')

var pool = mysql.createPool({
    connectionLimit: '10',
    host: 'localhost',
    user: 'me',
    password: 'secret',
    database: 'my_db'
})

var cached_states = cachem(pool, 1000, 'SELECT id, stateName from States')

FetchStates = async () => {
    let data_states = await cached_states.fetch()
    return data_states
}

FetchStates()
```

## Contribution
The package is in its budding stage. Refer to the github repository for all the suggestions, pull-requests, issues, everything.