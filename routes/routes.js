var request = require('request'),
  Rx = require('rx'),
  appRouter = function (app) {
    app.get("/", function (req, res) {
      if (!req.query.wiki) {
        return res.send({
          "status": "error",
          "message": "missing request info"
        });
      } else {
        var wikiReq = Rx.Observable.fromNodeCallback(request.get),
          call = wikiReq([
            'https://en.wikipedia.org/w/api.php',
            '?action=query',
            '&prop=extracts',
            '&format=json',
            '&exintro=1',
            '&explaintext=',
            '&titles=',
            req.query.wiki].join('')),
          subscription = call
            .subscribe(
            (wikiRes) => {
              return res.send(
                JSON.parse(wikiRes[1]).query.pages[
                  Object.keys(JSON.parse(wikiRes[1]).query.pages)[0]
                ].extract);
            },
            (err) => {
              console.log('Error: ' + err);
            },
            () => {
              console.log('Completed');
            });
      }
    });
  }

module.exports = appRouter;
