/**
 * Prompt: Given sample CSV's of online and offline donors, write code to 
 * compute the aggregate giving totals required to render leaderboards on a 
 * fundraising campaign.
    
Designation Leaderboard
Build a service that combines the data from both CSV's, and outputs the donor and dollar 
counts for each unique designation.

If time allows, write automated tests to support the code you've written.

Example: Scroll down to the Designation Leaderboard visual on this fundraising campaign.} 
str 
 */

import fs from 'fs';
import Papa from 'papaparse';

const fetchData = (fileName) => {
  // output data from csv
  const csv = fs.readFileSync(fileName, 'utf-8');
  const parsedData = Papa.parse(csv, { header: true });

  return parsedData.data;
};

const flattenOnlineDonors = (rawData) => {
  const flattenedData = [];
  for (const data of rawData) {
    const affiliations = JSON.parse(data.affiliation);
    if (Object.values(JSON.parse(data.designation)).length) {
      const designations = JSON.parse(data.designation);
      for (const key of Object.keys(designations)) {
        const normalized = {
          name: data.name,
          email: data.email,
          amount: designations[key],
          affiliation: Object.values(affiliations) ?? '',
          affiliation_value: affiliations?.alumni ?? '',
          designation_name: key,
          designation_value: designations[key],
        };

        flattenedData.push(normalized);
      }
    } else {
      const flatten = {
        name: data.name,
        email: data.email,
        amount: data.amount,
        affiliation: Object.values(affiliations) ?? '',
        affiliation_value: affiliations?.alumni ?? '',
        designation_name: '',
        designation_value: '',
      };
      flattenedData.push(flatten);
    }
  }

  return flattenedData;
};

const finalizeData = (list) => {
  const leaderboard = {};

  for (const donor of list) {
    //
    // designation_name: {
    //  donors: ['email', 'email2'],
    //  amount: 
   // }
  }

  // {
  //   '<designation>': {
  //     donors: "<number>",
  //     amount: "<amount>"
  //   }
  // }
}

const main = () => {
  // call fetch data for each csv

  const onlineDonorsRaw = fetchData('./data/online-donors.csv');
  const offlineDonorsRaw = fetchData('./data/offline-donors.csv');

  const flattenedOnlineDonors = flattenOnlineDonors(onlineDonorsRaw);


  
};

main();
