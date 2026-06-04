const fs = require("fs") // fs is short for filesystem
const url = "https://check-for-flooding.service.gov.uk/rainfall-station-csv/286392TP"

function parseCSV(text)
{
    const lines = text.trim().split("\n")
    const rows = []
    for (const line of lines.slice(1)) // slice(1) skips the header of the csv
    {
        if (!line.includes(",") continue
        const [timestamp, rainfall] = line.split(",")
        rows.push({ timestamp: timestamp.trim(), rainfall: rainfall.trim() })
    }
    return rows
}

function loadMaster()
{
    const text = fs.readFileSync("master.csv", "utf8")
    return parseCSV(text)
}

async function fetchData()
{
    const response = await fetch(url)
    const text = await response.text()
    return parseCSV(text)
}

async function main()
{
    const newRows = await fetchData()
    const existingRows = loadMaster()
    console.log("New rows:")
}

main()
