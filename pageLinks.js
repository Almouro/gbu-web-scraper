const cheerio = require('cheerio');
const request = require('request');

module.exports = (url) => {
  return new Promise((resolve, reject) => {
    const pageLinks = [];

    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        $ = cheerio.load(response.body);
        $('a').each((_, link) => {
           pageLinks.push($(link).attr('href'));
        });

        resolve(pageLinks);
      } else {
        if(response)
          reject(response.statusCode, error);
        else reject(null, error);
      }
    });
  });
};
