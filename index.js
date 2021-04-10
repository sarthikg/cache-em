const moment = require('moment')
var poolme = require('pool-me')

class cacheClass {

    constructor (pool, timeDiff, query, args=undefined) {
        this.pool = poolme(pool)
        this.timeDiff = timeDiff
        this.query = query
        this.args = args

        this.firstExecution = true
        this.results = {}
    }

    initiate = async () => {
        let connection = await this.pool.getConnection()
        this.results['data'] = await connection.query(this.query, this.args)
        this.results['endTime'] = this.handleTime()
        connection.release()
        return this.results.data
    }

    fetch = async () => {
        if (this.firstExecution === true) {
            this.firstExecution = false
            return await this.initiate()
        } else {
            let currentTime = moment()
            if (currentTime.isAfter(this.results.endTime)) {
                return await this.initiate()
            } else {
                return this.results.data
            }
        }
    }

    refresh = async () => {
        return await this.initiate()
    }

    clear = () => {
        this.results = {}
        this.firstExecution = true
    }

    handleTime = () => {
        let endTime = moment().add(this.timeDiff, 'ms')
        return endTime
    }
}


cache = (pool, timeDiff, query, args=null) => {
    return new cacheClass(pool, timeDiff, query, args)
}


module.exports = cache