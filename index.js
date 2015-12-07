const getLinksOnPage = require('./pageLinks');

const BASE_URL = "http://wp-gbl.gbu.fr";
const visitedPages = [];
const toVisitPages = [ BASE_URL ];

const hasVisitedPage = function (pageUrl) {
  console.log(visitedPages.length);
  return visitedPages.indexOf(pageUrl) !== -1;
};

const shouldVisitPage = function(pageLink) {
  return visitedPages.concat(toVisitPages).indexOf(pageLink) === -1;
};

const searchNextPageForBrokenLinks = function() {
  if (toVisitPages.length === 0) {
    console.log('Done.')
    return;
  }

  const nextPage = toVisitPages.pop();
  visitedPages.push(nextPage);

  console.log('Visiting ' + nextPage);

  getLinksOnPage(nextPage).then((pageLinks) => {
    console.log('Visited ' + nextPage);
    if (nextPage.indexOf(BASE_URL) === -1) return searchNextPageForBrokenLinks();
    visitedPages.push(nextPage);
    pageLinks.forEach((pageLink) => {
      if (pageLink.indexOf('tel:') === 0) return;
      if (pageLink.indexOf('mailto:') === 0) return;

      if (pageLink.indexOf('http') === -1) pageLink = BASE_URL + pageLink;

      if (shouldVisitPage(pageLink)) {
        toVisitPages.push(pageLink);
      }
    });
    searchNextPageForBrokenLinks();
  }, (statusCode, error) => {
    visitedPages.push(nextPage);
    console.log('Visited ' + nextPage + ' and got error: ', statusCode, error);
    setTimeout(searchNextPageForBrokenLinks, 3000);
  }).catch((err) => {
    console.error('hello', err);
    throw err;
  });
};

searchNextPageForBrokenLinks();
