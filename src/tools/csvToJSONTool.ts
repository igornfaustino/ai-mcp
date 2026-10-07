import { tool } from "@langchain/core/tools";

import csvtojson from "csvtojson";
import { z } from "zod";

export function getCsvToJSONTool() {
    return tool(async ({ csvText }) => {
        const result = await csvtojson().fromString(csvText);
        console.log('CSV to JSON conversion result:', result);
        return JSON.stringify(result);
    }, {
        name: "csv_to_json",
        description: "Converts CSV text to a JSON array. Input is a string of CSV data, output is a JSON array.",
        schema: z.object({
            csvText: z.string().describe("The CSV text to convert to JSON."),
        })
    })
}