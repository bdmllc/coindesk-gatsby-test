import React, { useState, useEffect } from "react"
import Chart from "react-apexcharts"
import { Card, Dimmer, Loader, Select } from "semantic-ui-react"
import "semantic-ui-css/semantic.min.css"

export default function ChartComponent() {
  const [loading, setLoading] = useState(true)
  const [priceData, setPriceData] = useState(null)
  const [currency, setCurrency] = useState(null)
  const [chartData, setChartData] = useState(null)
  const [series, setSeries] = useState(null)

  const options = [
    { value: "USD", text: "Bitcoin in USD " },
    { value: "EUR", text: "Bitcoin in EUR" },
    { value: "GBP", text: "Bitcoin in GPB" },
  ]

  useEffect(() => {
    async function fetchPrices() {
      const res = await fetch(
        "https://api.coindesk.com/v1/bpi/currentprice.json"
      )
      const data = await res.json()
      setCurrency(data.bpi.USD.code)
      setPriceData(data.bpi)
      getChartData()
    }
    fetchPrices()
  }, [])

  const getChartData = async () => {
    const res = await fetch(
      `https://api.coindesk.com/v1/bpi/historical/close.json?`
    )
    const data = await res.json()
    const categories = Object.keys(data.bpi)
    const series = Object.values(data.bpi)
    setChartData({
      xaxis: {
        categories: categories,
      },
    })
    setSeries([
      {
        name: "USD Bitcoin Price",
        data: series,
      },
    ])
    setLoading(false)
  }

  const handleSelect = (e, data) => {
    setCurrency(data.value)
  }

  return (
    <div className="container">
      <div className="nav" style={{ padding: "15px", backgroundColor: "gold" }}>
        Bitcoin Monthly Chart: Powered by CoinDesk API
      </div>
      {loading ? (
        <div>
          <Dimmer active inverted>
            <Loader>Loading</Loader>
          </Dimmer>
        </div>
      ) : (
        <>
          <div className="container" style={{ display: "flex" }}>
            <div
              className="price-container"
              style={{
                flexBasis: "150px",
                justifyContent: "space-around",
                alignItems: "center",
                width: 600,
                height: 300,
                margin: "0 auto",
                // border: "solid 1px black"
              }}
            >
              <div className="form">
                <Select
                  style={{ border: "1px solid black", marginTop: "1rem" }}
                  placeholder="Select your currency"
                  onChange={handleSelect}
                  options={options}
                />
              </div>
              <div className="price">
                <Card>
                  <Card.Content>
                    <Card.Header>{currency}: Last Closing Price</Card.Header>
                    <Card.Description>
                      {priceData[currency].rate}
                    </Card.Description>
                  </Card.Content>
                </Card>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "-12rem",
            }}
          >
            <Chart
              options={chartData}
              series={series}
              type="line"
              width="410"
              height="300"
            />
          </div>
        </>
      )}
    </div>
  )
}
