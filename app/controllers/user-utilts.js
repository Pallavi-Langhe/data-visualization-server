const getBarChartQuery = () => {
    return [
        {
            '$group': {
                '_id': '$feature_name',
                'totalValue': {
                    '$sum': '$value'
                }
            }
        }, {
            '$project': {
                'totalValue': 1,
                'featureName': '$_id'
            }
        }, {
            '$project': {
                '_id': 0
            }
        }, {
            '$sort': {
                'featureName': 1
            }
        }
    ]
}

const getLineChartQuery = (featureName) => {
    return [
        {
            '$match': {
                'feature_name': featureName
            }
        }, {
            '$group': {
                '_id': '$day',
                'value': {
                    '$sum': '$value'
                },
                'feature_name': {
                    '$first': '$feature_name'
                }
            }
        }, {
            '$sort': {
                'day': -1
            }
        }, {
            '$project': {
                'feature_name': 1,
                'value': 1,
                'day': 1
            }
        }, {
            '$project': {
                'day': '$_id',
                'value': '$value',
                'featureName': '$feature_name'
            }
        }, {
            '$project': {
                '_id': 0
            },
        }, {
            '$sort': {
                'day': 1
            }
        }
    ]
}
const userUtils = {
    getBarChartQuery, getLineChartQuery
}
module.exports = userUtils