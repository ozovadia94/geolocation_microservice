const Distance = require('./Models/distance')
const mongoose = require('mongoose')
const axios = require('axios')

const getHello = (req, res) => {
    res.status(200).send()
}

const QueryUpperCase = async (req,res,query) => {
    let { source, destination } = query

    if (!source || !destination) {
        res.status(400).send({"message": "Missing fields"})
        return null;
    }

    source = source.toUpperCase()
    destination = destination.toUpperCase()
    if (source > destination) {
        let temp = destination
        destination = source
        source = temp
    }
    else if (source === destination)
    {
        res.status(400).send({"message": "Equal source and destination"})
        return null
    }
        
    return { source, destination }
}

const getDistance = async (req, res) => {
    let query = await QueryUpperCase(req,res,req.query)

    if (query === null) {
        return;
    }
    const { source, destination } = query


    const find = await Distance.findOneAndUpdate({ "source": source, "destination": destination },
        { $inc: { "hits": 1 } })
        .catch((e) => {
            console.log("Dberror")
            res.status(500).send({ message: "DB problem"})
            return;
        })

    if (find && find.distance) {
        res.status(200).send({ "distance": find.distance })
        return;
    }

    const url = 'https://maps.googleapis.com/maps/api/distancematrix/json?' + `origins=${source}&destinations=${destination}&key=${process.env.GoogleAPI}`
    axios.get(url)
        .then((result => {
            if (result.data.rows[0].elements[0].status === 'OK') {
                let distance = result.data.rows[0].elements[0].distance['value'] / 1000

                const distanceOb = new Distance({
                    source: source, //
                    destination: destination,
                    distance: distance,
                    hits: 1,
                })

                distanceOb.save().then((result) => {
                    console.log("add. (from api)")
                    res.status(200).send({ distance: distance })

                }).catch((e) => {
                    // console.log(e)
                    res.status(500).send(e)
                })
            }
            else
                res.status(404).send({ "message": "Not Found" })



        })).catch((e) => {
            console.log("Can't find distance")
            res.status(404).send({"message": "Can't find distance"})
        })
}
const getHealth =  (req, res) => {
    try {
        const code =  mongoose.connection.readyState
        console.log(code)
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
    await Distance.find().sort({ hits: -1 }).limit(1).then((result) => {
        res.status(200).send({ "source": result[0].source, "destination": result[0].destination, "hits": result[0].hits })
    }).catch((e) => {
        console.log(e)
        res.status(404).send({"message": "Not found"})
        return;
    })

}

const postDistance = async (req, res) => {
    let query = await QueryUpperCase(req,res,req.body)

    if (query === null) {
        return
    }
    const { source, destination } = query

    const { distance } = req.body
    let hits = 1;

    if (!distance || distance < 0)//Check for a missing title
    {
        res.status(400).send({"message": "Missing fields"})
        return;
    }

    const x = await Distance.findOneAndDelete({ "source": source, "destination": destination })
        
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