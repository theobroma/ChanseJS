'use strict';

const fs = require('fs');
const path = require('path');
const dream = require('dreamjs');
const jsonfile = require('jsonfile');
const mkdirp = require('mkdirp');

//https://stackoverflow.com/questions/13696148/node-js-create-folder-or-use-existing
//make dir before saving file
const mkdirSync = function(dirPath) {
  try {
    fs.mkdirSync(dirPath);
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
};
//same
mkdirSync(path.resolve('./public'));

const config = {
  path: './public/data-ticket.json',
  priorityTypes: ['low','middle','high'],
  amount: 150,
  sebjuctWords:3
};

dream.customType('id', function(helper) {
  return helper.chance.integer({ min: 100000, max: 999999 });
});

dream.customType('status', function(helper) {
  return helper.chance.bool({likelihood: 60});
});

dream.customType('priority', function(helper) {
  return helper.oneOf(config.priorityTypes);
});

dream.customType('createdAt', function(helper) {
  return helper.chance.date({string: true, american: false});
});


dream.customType('lastAnswer', function(helper) {
  return helper.chance.bool({likelihood: 60});
});

dream.customType('subject', function(helper) {
  return helper.chance.sentence({ words: 3 });
});

dream.schema('ticket', {
  id: 'id',
  status: 'status',
  priority: 'priority',
  createdAt: 'createdAt',
  lastAnswer: 'lastAnswer',
  subject: 'subject'
});

dream
  .useSchema('ticket')
  .generateRnd(config.amount)
  .output((err, result) => {
    jsonfile.writeFile(config.path, result, { spaces: 2 }, function(err) {
      console.log(err ? err : `Data was generated and placed to ${config.path}`);
    });
  });
