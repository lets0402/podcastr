import { NowRequest, NowResponse } from "@vercel/node";
import site from "../../../../server.json";
const url = require("url");

export default async (request: NowRequest, response: NowResponse) => {
  const { method } = request;
  switch (method) {
    case "GET":
      const url_parts = url.parse(request.url, true);
      const query = url_parts.query;
      const limit = query?._limit;
      const sort = query?._sort;
      const order = query?._order;
      let result = site.episodes;

      if (limit != null) {
        result = site.episodes.splice(0, limit);
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

      response.status(200).json(result);
      break;
    case "POST":
      const { main, navbar, footer } = request.body;
      let novoConteudo = {
        site: [],
      };
      novoConteudo.site.push({ main, navbar, footer });
      response.status(200).json(novoConteudo);
      break;
    default:
      response.setHeader("Allow", ["GET", "POST"]);
      response.status(405).end(`Method ${method} Not Allowed`);
  }
};
