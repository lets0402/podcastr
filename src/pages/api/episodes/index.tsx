import { NowRequest, NowResponse } from "@vercel/node";
import data from "../../../../server.json";
const url = require("url");

export default async (request: NowRequest, response: NowResponse) => {
  const { method } = request;
  switch (method) {
    case "GET":
      const url_parts = url.parse(request.url, true);
      const query = url_parts.query;
      const id = query?.id;
      const limit = query?._limit;
      const sort = query?._sort;
      const order = query?._order;
      let result = data.episodes;

      if (id != null) {
        const episode = data.episodes.find((item) => item.id === id);
        return response.status(200).send({ episodes: episode });
      }

      if (limit != null) {
        result = data.episodes.splice(0, limit);
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

      return response.status(200).send({ episodes: result });
      break;
    default:
      response.setHeader("Allow", ["GET", "POST"]);
      response.status(405).end(`Method ${method} Not Allowed`);
  }
};
