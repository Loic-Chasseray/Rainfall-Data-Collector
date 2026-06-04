const url = "https://check-for-flooding.service.gov.uk/rainfall-station-csv/286392TP"

async function main()
{
    const response = await fetch(url)
    const text = await response.text()
    console.log(text)
}

main()
