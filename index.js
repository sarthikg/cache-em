const moment = require('moment')

class cacheClass {

    constructor (pool, query, timeDiff) {
        this.query = query;
        this.firstExecution = true,
        this.timeDiff = timeDiff;
        this.pool = pool
        this.results = {}
    }

    initiate = async () => {
        let connection = await this.pool.getConnection()
        this.results['data'] = await connection.query(this.query)
        this.results['endTime'] = this.handleTime()
        connection.release()
        return this.results
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
                return this.results
            }
        }

    }

    handleTime = () => {
        let endTime = moment().add(this.timeDiff, 'minutes')
        return endTime
    }
}


cache = (pool, query, timeDiff) => {
    return new cacheClass(pool, query, timeDiff)
}


module.exports = cache