var request = require('request');
var appRouter = function(app) {
  app.get("/", function(req, res) {
    if (!req.query.wiki) {
      return res.send({
        "status": "error",
        "message": "missing request info"
      });
    } else {
      request('https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=1&explaintext=&titles=' + req.query.wiki, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          var c = JSON.parse(body),
            grabPage = Object.keys(c.query.pages)[0];

          return res.send(c.query.pages[grabPage].extract);
        }
      });
    }
  });
}

module.exports = appRouter;
