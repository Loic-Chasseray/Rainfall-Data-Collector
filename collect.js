const fs = require("fs") // fs is short for filesystem
const url = "https://check-for-flooding.service.gov.uk/rainfall-station-csv/286392TP"

function parseCSV(text)
{
    const lines = text.trim().split("\n")
    const rows = []
    for (const line of lines.slice(1)) // slice(1) skips the header of the csv
    {
        if (!line.includes(",")) continue // skip lines with no comma
        const [timestamp, rainfall] = line.split(",")
        rows.push({ timestamp: timestamp.trim(), rainfall: rainfall.trim() })
    }
    return rows
}

function saveCSV(rows)
{
    const header = "Timestamp (UTC),Rainfall (mm)"
    const lines = [header]
    for (const row of rows)
    {
        const line = row.timestamp + "," + row.rainfall
        lines.push(line)
    }
    const text = lines.join("\n")
    fs.writeFileSync("master.csv", text, "utf8")
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

function merge(existingRows, newRows)
{
    /*
    new rows are favoured over existing rows because the loop checks the new rows
    before the existing rows. this is important because data for the most recent timestamp
    is often 0 but then updates if data is collected.
    */
    const combined = newRows.concat(existingRows)
    const seen = new Set()
    const deduped = [] // deduped means deduplicated where duplicate data has been removed
    for (const row of combined)
    {
        if (!seen.has(row.timestamp))
        {
            seen.add(row.timestamp)
            deduped.push(row)
        }
    }
    deduped.sort((a, b) => a.timestamp.localeCompare(b.timestamp)) // sort by oldest to newest dates
    return deduped
}

async function main()
{
    const newRows = await fetchData()
    const existingRows = loadMaster()
    const mergedRows = merge(existingRows, newRows)
    saveCSV(mergedRows)
    console.log("New rows:", newRows.length)
    console.log("Existing rows:", existingRows.length)
    console.log("Merged rows:", mergedRows.length)
}

main()
