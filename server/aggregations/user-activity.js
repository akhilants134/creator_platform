export default [
    { $group: { _id: '$user', activityCount: { $sum: 1 } } },
    { $sort: { activityCount: -1 } },
    { $limit: 10 }
];
