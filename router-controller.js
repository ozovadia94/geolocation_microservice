const Distance = require('./Models/distance')
const mongoose = require('mongoose')
const axios = require('axios')

const getHello = (req, res) => {
    res.status(200).send()
}

const getDistance = async (req, res) => {
    let { source, destination } = req.query
    if (source > destination) {
        let temp = destination
        destination = source
        source = temp
    }

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


    const url = 'https://maps.googleapis.com/maps/api/distancematrix/json?'
    axios.get(url + 'origins=' + source +
        '&destinations=' + destination +
        '&key=' + "AIzaSyD_r3u549Xdp70nj1CiLlAJf2nvAKHV8Ys").then((result => {

            let distance = result.data.rows[0].elements[0].distance['value'] / 1000

            const distanceOb = new Distance({
                source: source, //
                destination: destination,
                distance: distance,
                hits: 1,
            })

            distanceOb.save().then((result) => {
                console.log("add")

            }).catch((e) => {
                console.log(e)
                res.status(500).send(e)
            })

            res.status(200).send({ distance: distance })
        })).catch((e) => {
            console.log("Can't find")
            res.status(404).send()
        })
}
const getHealth = (req, res) => {
    try {
        const code = mongoose.connection.readyState
        if (code == 1){
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
    var { source, destination, distance } = req.body
    let hits = 1;

    if (!source || !destination || !distance)//Check for a missing title
    {
        console.log('data error')
        res.status(500).send()
    }

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
        res.status(201).send({"source":result.source,"destination":result.destination,"hits":result.hits})
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