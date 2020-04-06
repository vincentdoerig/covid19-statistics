import express from "express";
import cors from "cors";
import cheerio from "cheerio";
import fetch from "node-fetch";

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  fetch("https://www.worldometers.info/coronavirus/")
    .then((res) => res.text())
    .then((body) => {
      const $ = cheerio.load(body);

      const toNumber = (string: string) => parseInt(string.replace(/\,/g, ""));

      const mainCounter = $("div.maincounter-number span");
      const subtitleCounter = $("div.number-table-main");
      const detailCounter = $("span.number-table");

      // Overall
      const cases: number = toNumber(mainCounter[0].children[0].data.trim());
      const deaths: number = toNumber(mainCounter[1].children[0].data.trim());
      const recovered: number = toNumber(
        mainCounter[2].children[0].data.trim()
      );

      // Active cases
      const active: number = toNumber(
        subtitleCounter[0].children[0].data.trim()
      );
      const activeMild: number = toNumber(
        detailCounter[0].children[0].data.trim()
      );
      const activeSerious: number = toNumber(
        detailCounter[1].children[0].data.trim()
      );

      // Closed cases
      const closed: number = toNumber(
        subtitleCounter[1].children[0].data.trim()
      );
      const closedRecovered: number = toNumber(
        detailCounter[2].children[0].data.trim()
      );
      const closedDeaths: number = toNumber(
        detailCounter[3].children[0].data.trim()
      );

      // Last updated at
      const lastUpdate: string = $("#page-top")
        .next()
        .text()
        .substr("Last updated: ".length);

      return {
        cases,
        deaths,
        recovered,
        active: {
          total: active,
          mild: activeMild,
          serious: activeSerious,
        },
        closed: {
          total: closed,
          recovered: closedRecovered,
          deaths: closedDeaths,
        },
        lastUpdate,
      };
    })
    .then((data) => res.json(data));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
