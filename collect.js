const url = "https://check-for-flooding.service.gov.uk/rainfall-station-csv/286392TP"

function parseCSV(text)
{
    const lines = text.trim().split("\n")
    const rows = []
    for (const line of lines.slice(1)) // slice(1) skips the header of the csv
    {
        const [timestamp, rainfall] = line.split(",")
        rows.push({ timestamp: timestamp.trim(), rainfall: rainfall.trim() })
    }
    return rows
}

async function main()
{
    const response = await fetch(url)
    const text = await response.text()
    const rows = parseCSV(text)
    console.log(rows)
}

main()
