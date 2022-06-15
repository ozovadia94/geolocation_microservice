const Distance = require('./Models/distance')
const mongoose = require('mongoose')
const axios = require('axios')

const getHello = (req, res) => {
    res.status(200).send()
}

const QueryUpperCase = async (query)=>{
    let { source, destination } = query
    if (!source || !destination) {
        return null;
    }
    
    source = source.toUpperCase()
    destination = destination.toUpperCase()
    if (source > destination) {
        let temp = destination
        destination = source
        source = temp
    }
    else if(source===destination)
        return null
    return {source,destination}
}

const getDistance = async (req, res) => {
    let query = await QueryUpperCase(req.query)

    if (query===null) {
        res.status(500).send()
        return
    }
    const { source, destination } = query


    const find = await Distance.findOneAndUpdate({ "source": source, "destination": destination },
        { $inc: { "hits": 1 } }).then(result => {
            return result
        }).catch((e) => {
            console.log("Dberror")
        })

    if (find !== null && find.distance) {
        res.status(200).send({ "distance": find.distance })
        return;
    }

    const url = 'https://maps.googleapis.com/maps/api/distancematrix/json?' + `origins=${source}&destinations=${destination}&key=${process.env.GoogleAPI}`
    axios.get(url).then((result => {
        let distance = result.data.rows[0].elements[0].distance['value'] / 1000

        const distanceOb = new Distance({
            source: source, //
            destination: destination,
            distance: distance,
            hits: 1,
        })

        distanceOb.save().then((result) => {
            console.log("add. (from api)")

        }).catch((e) => {
            console.log(e)
            res.status(500).send(e)
        })

        res.status(200).send({ distance: distance })
    })).catch((e) => {
        console.log("Can't find distance")
        res.status(404).send()
    })
}
const getHealth = (req, res) => {
    try {
        const code = mongoose.connection.readyState
        if (code == 1) {
            res.status(200).send()//ok
            return;
        }
    }
    catch (e) {
        console.log(e)
    }
    res.status(500).send()
}

const getPopularsearch = async (req, res) => {
    await Distance.find().then((result) => {
        let max_val = 0;
        let max_index = result[0]
        for (let key in result) {
            if (result[key].hits > max_val) {
                max_val = result[key].hits
                max_index = key
            }
        }
        res.status(200).send({ "source": result[max_index].source, "destination": result[max_index].destination, "hits": result[max_index].hits })
    }).catch((e) => {
        console.log(e)
        res.status(404).send()
        return;
    })

}

const postDistance = async (req, res) => {
    let query = await QueryUpperCase(req.body)

    if (query===null) {
        res.status(500).send()
        return
    }
    const { source, destination } = query

    var {distance } = req.body
    let hits = 1;

    if (!distance || distance < 0)//Check for a missing title
    {
        res.status(500).send()
        return;
    }
    source.toUpperCase()
    destination.toUpperCase()

    if (source > destination) {
        let temp = destination
        destination = source
        source = temp
    }

    var x = await Distance.findOneAndDelete({ "source": source, "destination": destination })
        .then(result => {
            return result
        })
    if (x !== null) {
        hits = x.hits
    }

    const distanceOb = new Distance({
        source: source, //
        destination: destination,
        distance: distance,
        hits: hits,
    })

    distanceOb.save().then((result) => {
        res.status(201).send({ "source": result.source, "destination": result.destination, "hits": result.hits })
        // res.status(201).send()

    }).catch((e) => {
        console.log(e)
        res.status(500).send(e)
    })
}

module.exports = {
    getHello,
    getDistance,
    getHealth,
    getPopularsearch,
    postDistance
}