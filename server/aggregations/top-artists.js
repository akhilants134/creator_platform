export default [
  { $group: { _id: '$artist', totalSongs: { $sum: 1 } } },
  { $sort: { totalSongs: -1 } },
  { $limit: 10 }
];
