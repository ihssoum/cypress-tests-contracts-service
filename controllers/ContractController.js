const fs = require("fs");
const path = require("path");
const StrategyContext = require("../services/StrategyContext");
const { log } = require("console");

const loadJson = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (error) {
    throw new Error(`Error loading JSON file at ${filePath}: ${error.message}`);
  }
};

const contractController = {
  getContract: (req, res) => {
    const { client } = req.query;
    console.log(`Loading client data for ${client}`);

    if (!client) {
      return res
        .status(400)
        .json({ error: "Client must be specified in the query parameter" });
    }

    const schemaPath = path.join(__dirname, "../schemas/contract.json");
    let schema;

    try {
      schema = loadJson(schemaPath);
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Failed to load schema: ${error.message}` });
    }

    let clientData;
    try {
      const clientDataPath = path.join(
        __dirname,
        `../data/${client.toLowerCase()}/contract.json`
      );
      clientData = loadJson(clientDataPath);
    } catch (error) {
      return res
        .status(404)
        .json({ error: `Client data for ${client} not found` });
    }

    try {
      const context = new StrategyContext(client, clientData);
      const result = context.executeMapping(schema);
      res.json(result);
    } catch (error) {
      res
        .status(500)
        .json({ error: `Failed to process the request: ${error.message}` });
    }
  },
};

module.exports = contractController;
