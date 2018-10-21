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
  path: './public/data.json',
  amount: 150,
  phraseLength: 15,
  images: ['cat', 'dog', 'fox', 'koala', 'lion', 'owl', 'penguin', 'pig', 'raccoon', 'sheep']
};

dream.customType('user-image', function(helper) {
  return helper.oneOf(config.images);
});

dream.customType('user-phrase', function(helper) {
  return helper.chance.sentence({ words: config.phraseLength });
});

dream.customType('incrementalId', function(helper) {
  return helper.previousItem ? helper.previousItem.id + 1 : 0;
});

dream.customType('firstName', function(helper) {
  return helper.chance.name().split(' ')[0];
});

dream.customType('secondName', function(helper) {
  return helper.chance.name().split(' ')[0];
});

dream.customType('mongodId', function(helper) {
  return mongoObjectId();
});

var mongoObjectId = function() {
  var timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
  return (
    timestamp +
    'xxxxxxxxxxxxxxxx'
      .replace(/[x]/g, function() {
        return ((Math.random() * 16) | 0).toString(16);
      })
      .toLowerCase()
  );
};

dream.schema('user', {
  id: 'mongodId',
  firstName: 'firstName',
  secondName: 'secondName',
  phone: 'phone',
  gender: 'gender',
  age: 'age'
});

dream
  .useSchema('user')
  .generateRnd(config.amount)
  .output((err, result) => {
    jsonfile.writeFile(config.path, result, { spaces: 2 }, function(err) {
      console.log(err ? err : `Data was generated and placed to ${config.path}`);
    });
  });
