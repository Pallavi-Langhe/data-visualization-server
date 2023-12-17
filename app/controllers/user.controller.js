const db = require("../models");
const Feature = db.feature;
const userUtils = require("./user-utilts");


exports.getBarChartData = async (req, res) => {
  let barChartQuery = [
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
  ];
  if ((req.body.startDate && req.body.endDate) || (req.body.age || req.body.gender)) {
    console.log("filterQuery is requested");
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const age = req.body.age;
    const gender = req.body.gender;
    barChartQuery = [
      {
        '$match': getMatchQuery(startDate, endDate, age, gender)
      },
      ...barChartQuery
    ];
  }
  const result = await Feature.aggregate(barChartQuery);
  if (result.length < 1) {
    res.status(200).json({ count: 0, data: [] })
  }
  res.status(200).json({ count: result.length, data: result })
};

exports.getLineChartData = async (req, res) => {
  console.log(req.body.featureName);
  const featureName = req.body.featureName;

  const lineChartQuery = userUtils.getLineChartQuery(featureName);
  console.log("lineChartQuery: ", lineChartQuery)
  const result = await Feature.aggregate(lineChartQuery);
  if (result.length < 1) {
    res.status(200).json({ count: 0, data: [] })
  }

  res.status(200).json({ count: result.length, data: result })
};



exports.getFilteredData = async (req, res) => {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const age = req.body.age;
  const gender = req.body.gender;
  const filterQuery = [
    {
      '$match': getMatchQuery(startDate, endDate, age, gender)
    }, {
      '$group': {
        '_id': '$feature_name',
        'totalValues': {
          '$sum': '$value'
        }
      }
    }, {
      '$project': {
        'featureName': '$_id',
        'totalValues': 1
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
  ];

  console.log("Query: ", JSON.stringify(filterQuery));
  const result = await Feature.aggregate(filterQuery);
  if (result.length < 1) {
    res.status(200).json({ count: 0, data: [] })
  }

  res.status(200).json({ count: result.length, data: result })

}

const getMatchQuery = (startDate, endDate, age, gender) => {
  const query = {};
  if (startDate) {
    query['day'] = {
      '$gt': new Date(startDate),
      '$lt': new Date(endDate)
    }
  }
  if (age) {
    query['age'] = age
  }
  if (gender) {
    query['gender'] = gender
  }
  return query;
}

// exports.adminBoard = (req, res) => {
//   res.status(200).send("Admin Content.");
// };

// exports.moderatorBoard = (req, res) => {
//   res.status(200).send("Moderator Content.");
// };

