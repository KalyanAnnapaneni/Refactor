const { writeFile } = require('fs');
const { join } = require('path');
const request = require('request');
const blend = require('@mapbox/blend');
const argv = require('minimist')(process.argv.slice(2));

const {
  greeting = 'Hello', who = 'You',
  width = 400, height = 500, color = 'Pink', size = 100,
} = argv;

const makeRequest = greeting => {
  const req = {
    url: 'https://cataas.com/cat/says/' + greeting + '?width=' + width + '&height=' + height + '&color' + color + '&s=' + size, encoding: 'binary',
  };
  return new Promise((resolve, reject) => {
    request.get(req, (err, res, body) => {
      if (err) {
        reject(err);
      }
      resolve(body);
    });
  });
};

const createCatPicture = async () => {
  const firstBody = await makeRequest(greeting);
  const secondBody = await makeRequest(who);
  blend([
    { buffer: new Buffer(firstBody, 'binary'), x: 0, y: 0 },
    { buffer: new Buffer(secondBody, 'binary'), x: width, y: 0 },
  ],
    { width: width * 2, height: height, format: 'jpeg' },
    (err, data) => {
      const fileOut = join(process.cwd(), `/cat-card.jpg`);

      writeFile(fileOut, data, 'binary', err => {
        if (err) {
          return;
        }
        console.log('Cat picture ready!'); //eslint-disable-line
      });
    });
};

createCatPicture();
