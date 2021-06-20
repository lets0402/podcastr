const express = require("express");
const bodyParser = require("body-parser");
const url = require("url");
const data = require("./server.json");

const app = express();

//Init Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => res.send("API running"));

app.get("/episodes/:id", async (req, res) => {
  try {
    const { episodes } = data;
    const episode = episodes.find((item) => item.id === req.params.id);
    if (!episode) {
      return res.status(404).json({ msg: "URL não encontrada" });
    }
    res.json(episode);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/episodes", async (req, res) => {
  try {
    let result = data.episodes;
    const url_parts = url.parse(req.url, true);
    const query = url_parts.query;
    const limit = query?._limit;
    const sort = query?._sort;
    const order = query?._order;

    if (limit != null) {
      result = result.splice(0, limit);
    }

    if (sort != null) {
      if (order != null) {
        if (order == "desc")
          result = result.sort(function (a, b) {
            return b[sort] - a[sort];
          });
      }

      result = result.sort(function (a, b) {
        return a[sort] - b[sort];
      });
    }

    return res.status(200).send({ episodes: result });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(err.message);
  }
});

const PORT = process.env.PORT || 80;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
