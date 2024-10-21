import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GoldPrice.css'; // Import the CSS file

function GoldPrice() {
    const [goldPricePerOunce, setGoldPricePerOunce] = useState(null);
    const [goldPricePerGram24k, setGoldPricePerGram24k] = useState({ usd: null, ils: null });
    const [goldPricePerGram18k, setGoldPricePerGram18k] = useState({ usd: null, ils: null });
    const [goldPricePerGram14k, setGoldPricePerGram14k] = useState({ usd: null, ils: null });
    const [exchangeRate, setExchangeRate] = useState(null); // Exchange rate USD to ILS
    const [storedPrices, setStoredPrices] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch gold price from GoldAPI and exchange rate from Fixer.io
    const fetchPrices = async () => {
        try {
            // Fetch gold price in USD
            const goldResponse = await axios.get('https://www.goldapi.io/api/XAU/USD', {
                headers: {
                    'x-access-token': 'goldapi-9edsxc19m0h0qzkk-io', // Replace with your actual API key
                    'Content-Type': 'application/json'
                }
            });
            const pricePerOunce = goldResponse.data.price;
            console.log("Gold Price per Ounce in USD:", pricePerOunce); // Debugging
            setGoldPricePerOunce(pricePerOunce);

            // Fetch exchange rate USD to ILS using Fixer.io
            const exchangeResponse = await axios.get('http://data.fixer.io/api/latest', {
                params: {
                    access_key: '96edce994696d815b04856fc9958d401',
                    symbols: 'USD,ILS'
                },
            });
            const rates = exchangeResponse.data.rates;
            const eurToUsd = rates.USD;
            const eurToIls = rates.ILS;
            const usdToIlsRate = eurToIls / eurToUsd;
            console.log("Calculated Exchange Rate USD to ILS:", usdToIlsRate); // Debugging
            setExchangeRate(usdToIlsRate);

            calculateGoldPrices(pricePerOunce, usdToIlsRate);
        } catch (error) {
            console.error('Error fetching prices:', error.response ? error.response.data : error.message);
        }
    };

    // Calculate prices per gram for 24k, 18k, and 14k gold in both USD and ILS
    const calculateGoldPrices = (pricePerOunce, usdToIlsRate) => {
        const pricePerGram24kUSD = pricePerOunce / 31.1035; // Convert price per ounce to price per gram for 24k gold in USD
        const pricePerGram18kUSD = pricePerGram24kUSD * (18 / 24); // Adjust for 18k gold in USD
        const pricePerGram14kUSD = pricePerGram24kUSD * (14 / 24); // Adjust for 14k gold in USD

        // Calculate prices in ILS
        const pricePerGram24kILS = pricePerGram24kUSD * usdToIlsRate;
        const pricePerGram18kILS = pricePerGram18kUSD * usdToIlsRate;
        const pricePerGram14kILS = pricePerGram14kUSD * usdToIlsRate;

        setGoldPricePerGram24k({ usd: pricePerGram24kUSD, ils: pricePerGram24kILS });
        setGoldPricePerGram18k({ usd: pricePerGram18kUSD, ils: pricePerGram18kILS });
        setGoldPricePerGram14k({ usd: pricePerGram14kUSD, ils: pricePerGram14kILS });
    };

    // Store gold prices in MongoDB
    const storePriceInDB = async () => {
        setLoading(true);
        try {
            const data = {
                pricePerOunce: goldPricePerOunce,
                pricePerGram24kUSD: goldPricePerGram24k.usd,
                pricePerGram18kUSD: goldPricePerGram18k.usd,
                pricePerGram14kUSD: goldPricePerGram14k.usd,
                pricePerGram24kILS: goldPricePerGram24k.ils,
                pricePerGram18kILS: goldPricePerGram18k.ils,
                pricePerGram14kILS: goldPricePerGram14k.ils,
                exchangeRateUSDToILS: exchangeRate,
                date: new Date().toISOString(),
            };
            await axios.post('http://localhost:5000/api/ortidb', data);
            alert('Prices stored in database!');
            fetchStoredPrices();
        } catch (error) {
            console.error('Error storing prices in database:', error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch stored prices from MongoDB
    const fetchStoredPrices = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/ortidb');
            setStoredPrices(response.data);
        } catch (error) {
            console.error('Error fetching stored prices:', error.response ? error.response.data : error.message);
        }
    };

    // Fetch gold price and exchange rate on component mount
    useEffect(() => {
        fetchPrices();
        fetchStoredPrices();
    }, []);

    return (
        <div className="container">
            <div className="flex-row">
                <h2>מחשבון תכשיטי זהב</h2>
                {goldPricePerOunce !== null && exchangeRate !== null ? (
                    <>
                        <div>
                            <p>מחיר אונקיה: ${goldPricePerOunce.toFixed(2)} / ₪{(goldPricePerOunce * exchangeRate).toFixed(2)}</p>
                            <p>מחיר לגרם (24k): ${goldPricePerGram24k.usd?.toFixed(2)} / ₪{goldPricePerGram24k.ils?.toFixed(2)}</p>
                            <p>מחיר לגרם (18k): ${goldPricePerGram18k.usd?.toFixed(2)} / ₪{goldPricePerGram18k.ils?.toFixed(2)}</p>
                            <p>מחיר לגרם (14k): ${goldPricePerGram14k.usd?.toFixed(2)} / ₪{goldPricePerGram14k.ils?.toFixed(2)}</p>
                        </div>
                    </>
                ) : (
                    <p>טוען נתונים...</p>
                )}
                <button onClick={storePriceInDB} disabled={loading || goldPricePerOunce === null || exchangeRate === null}>
                    {loading ? 'שומר...' : 'שמור נתונים'}
                </button>
            </div>

            <h3>Stored Prices</h3>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Price per Ounce (USD/ILS)</th>
                        <th>Price per Gram (24k) (USD/ILS)</th>
                        <th>Price per Gram (18k) (USD/ILS)</th>
                        <th>Price per Gram (14k) (USD/ILS)</th>
                    </tr>
                </thead>
                <tbody>
                    {storedPrices.length > 0 ? (
                        storedPrices.map((entry, index) => (
                            <tr key={index}>
                                <td>{new Date(entry.date).toLocaleString()}</td>
                                <td>
                                    ${entry.pricePerOunce?.toFixed(2)} / ₪{(entry.pricePerOunce * entry.exchangeRateUSDToILS)?.toFixed(2)}
                                </td>
                                <td>
                                    ${entry.pricePerGram24kUSD?.toFixed(2)} / ₪{entry.pricePerGram24kILS?.toFixed(2)}
                                </td>
                                <td>
                                    ${entry.pricePerGram18kUSD?.toFixed(2)} / ₪{entry.pricePerGram18kILS?.toFixed(2)}
                                </td>
                                <td>
                                    ${entry.pricePerGram14kUSD?.toFixed(2)} / ₪{entry.pricePerGram14kILS?.toFixed(2)}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No stored data</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default GoldPrice;
