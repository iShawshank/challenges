import Papa from 'papaparse';
import fs from 'fs';

const fetchData = (fileName) => {
  const csv = fs.readFileSync(fileName, 'utf-8');
  const parsedData = Papa.parse(csv, { header: true });
  return parsedData.data;
};

const determineDesinations = (onlineRaw, offlineRaw) => {
  const leaderboard = {};

  // Add online donations
  for (const data of onlineRaw) {
    const designations = JSON.parse(data.designation);
    if (Object.keys(designations).length) {
      for (const key of Object.keys(designations)) {
        if (leaderboard[key]) {
          const emails = new Set(leaderboard[key].email[0]);
          emails.add(data.email);
          leaderboard[key] = {
            donors: Array.from(emails),
            amount:
              Number(data.amount) + Number(leaderboard[key].amount),
          };
        } else {
          leaderboard[key] = {
            donors: [data.email],
            amount: Number(designations[key]),
          };
        }
      }
    }
  }

  // add offline donations
  for (const data of offlineRaw) {
    if (leaderboard[data.designation_name]) {
      const emails = new Set(
        leaderboard[data.designation_name].donors
      );
      emails.add(data.email);
      leaderboard[data.designation_name] = {
        donors: Array.from(emails),
        amount:
          Number(leaderboard[data.designation_name].amount) +
          Number(data.designated_amount),
      };
    } else if (data.designation_name !== '') {
      // add new
      leaderboard[data.designation_name] = {
        donors: [data.email],
        amount: Number(data.designated_amount),
      };
    }
  }

  return leaderboard;
};

const formatLeaderboard = (leaderboardRaw) => {
  const keys = Object.keys(leaderboardRaw);
  const unsortedLeaderboard = [];
  const leaderboard = [];

  // Format hashmap to array of objects
  for (const key of keys) {
    const obj = {
      name: key,
      donors: leaderboardRaw[key].donors.length,
      amount: leaderboardRaw[key].amount,
    };
    leaderboard.push(obj);
  }

  // sort the leaderboard by amount
  leaderboard.sort((a, b) => a.amount > b.amount);
  return leaderboard;
};

const main = () => {
  const offlineRaw = fetchData('./data/offline-donors.csv');
  const onlineRaw = fetchData('./data/online-donors.csv');

  const rawLeaderboard = determineDesinations(onlineRaw, offlineRaw);
  console.log(formatLeaderboard(rawLeaderboard));
};

main();