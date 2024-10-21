import React, { useState, useEffect } from 'react';
import JewelryTable from '../JewelryTable/JewelryTable'
import useToken from '../../useToken'; // Custom hook
import axios from 'axios';
import './JewelryCalculator.css';

function JewelryCalculator({
    goldPrice14k = { ils: 0, usd: 0 }, 
    goldPrice18k = { ils: 0, usd: 0 }, 
    goldPrice24k = { ils: 0, usd: 0 }
}) {
    const [jewelryName, setJewelryName] = useState('');
    const [selectedGoldType, setSelectedGoldType] = useState('14k');
    const [selectedCurrency, setSelectedCurrency] = useState('ILS');
    const [stonePrice, setStonePrice] = useState(0);
    const [weight, setWeight] = useState(0);
    const [settingPrice, setSettingPrice] = useState(0);
    const [extraCost, setExtraCost] = useState(0);
    const [printCost, setPrintCost] = useState(0);
    const [fixPrice, setFixPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(null);
    const [priceForCustomer, setPriceForCustomer] = useState(null);
    const [workTimeCost, setWorkTimeCost] = useState(0);
    const [jewelryData, setJewelryData] = useState([]);
    const [showDetails, setShowDetails] = useState(false);

    const token = useToken(); // Get token using custom hook

    const getGoldPrice = () => {
        switch (selectedGoldType) {
            case '14k':
                return selectedCurrency === 'ILS' ? goldPrice14k.ils : goldPrice14k.usd;
            case '18k':
                return selectedCurrency === 'ILS' ? goldPrice18k.ils : goldPrice18k.usd;
            case '24k':
            default:
                return selectedCurrency === 'ILS' ? goldPrice24k.ils : goldPrice24k.usd;
        }
    };

    const calculateTotal = () => {
        const goldPrice = getGoldPrice();
        const packageCost = 20; 
        const calculatedWorkTimeCost = weight * (selectedCurrency === 'ILS' ? 15 * goldPrice24k.ils / goldPrice24k.usd : 15);
        setWorkTimeCost(calculatedWorkTimeCost);

        const total = (
            (goldPrice * weight) +
            stonePrice +
            settingPrice +
            printCost +
            extraCost +
            fixPrice +
            packageCost +
            calculatedWorkTimeCost
        ) * 1.2; 

        if (!isNaN(total)) {
            const formattedTotalPrice = total.toFixed(2);
            setTotalPrice(formattedTotalPrice);
            setPriceForCustomer((total * 2).toFixed(2)); 
            setShowDetails(true); 
        } else {
            setTotalPrice('Calculation error');
            setPriceForCustomer('Calculation error');
            setShowDetails(false); 
        }
    };

    const handlePrintCheckboxChange = (e) => {
        setPrintCost(e.target.checked ? 60 : 0); 
    };

    const storePriceInDB = async () => {
        try {
            const data = {
                jewelryName,
                selectedGoldType,
                selectedCurrency,
                stonePrice,
                weight,
                settingPrice,
                extraCost,
                printCost,
                fixPrice,
                totalPrice,
                priceForCustomer,
                workTimeCost,
                date: new Date().toISOString(),
            };
            const response = await axios.post('http://localhost:5000/api/jewelryData', data, {
                headers: {
                    Authorization: `Bearer ${token}`, // Attach token
                },
            });

            setJewelryData(prevData => [...prevData, response.data]); 
            alert('Jewelry data stored in database!');
        } catch (error) {
            console.error('Error storing jewelry data in database:', error.response ? error.response.data : error.message);
        }
    };

    const fetchJewelryData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/jewelryData', {
                headers: {
                    Authorization: `Bearer ${token}`, // Add token to fetch requests too
                },
            });
            setJewelryData(response.data || []);
        } catch (error) {
            console.error('Error fetching jewelry data:', error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        fetchJewelryData();
    }, []);

    return (
        <div className='container'>
            <div className="jewelry-calculator-container">
                <div className="form-container">
                    <h2>Jewelry Price Calculator</h2>
                    <form onSubmit={(e) => e.preventDefault()} className="form-grid">
                        {/* Form Fields */}
                        <div className="form-row">
                            <label htmlFor="jewelryName">שם תכשיט </label>
                            <input
                                type="text"
                                id="jewelryName"
                                value={jewelryName}
                                onChange={(e) => setJewelryName(e.target.value)}
                            />
                        </div>

                        <div className="form-row">
                            <label htmlFor="goldType">זהב</label>
                            <select
                                id="goldType"
                                value={selectedGoldType}
                                onChange={(e) => setSelectedGoldType(e.target.value)}
                            >
                                <option value="14k">14k</option>
                                <option value="18k">18k</option>
                                <option value="24k">24k</option>
                            </select>
                        </div>

                        <div className="form-row">
                            <label htmlFor="currency">מטבע</label>
                            <select
                                id="currency"
                                value={selectedCurrency}
                                onChange={(e) => setSelectedCurrency(e.target.value)}
                            >
                                <option value="ILS">ILS</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>

                        <div className="form-row">
                            <label htmlFor="stonePrice">מחיר אבן (ILS):</label>
                            <input
                                type="number"
                                id="stonePrice"
                                value={stonePrice}
                                onChange={(e) => setStonePrice(Number(e.target.value))}
                            />
                        </div>

                        <div className="form-row">
                            <label htmlFor="weight">משקל (grams):</label>
                            <input
                                type="number"
                                id="weight"
                                value={weight}
                                onChange={(e) => setWeight(Number(e.target.value))}
                            />
                        </div>

                        <div className="form-row">
                            <label htmlFor="settingPrice">שיבוץ (ILS):</label>
                            <input
                                type="number"
                                id="settingPrice"
                                value={settingPrice}
                                onChange={(e) => setSettingPrice(Number(e.target.value))}
                            />
                        </div>

                        <div className="form-row">
                            <label htmlFor="extraCost">הוצאות (ILS):</label>
                            <input
                                type="number"
                                id="extraCost"
                                value={extraCost}
                                onChange={(e) => setExtraCost(Number(e.target.value))}
                            />
                        </div>

                        <div className="form-row">
                            <label htmlFor="fixPrice">מחיר מתוקן (ILS):</label>
                            <input
                                type="number"
                                id="fixPrice"
                                value={fixPrice}
                                onChange={(e) => setFixPrice(Number(e.target.value))}
                            />
                        </div>

                        <div className="form-row">
                            <label htmlFor="print">לכלול הדפסה? (60 ILS):</label>
                            <input
                                type="checkbox"
                                id="print"
                                onChange={handlePrintCheckboxChange}
                            />
                        </div>

                        <div className="button-row">
                            <button type="button" onClick={calculateTotal}>
                                חישוב מחיר כולל
                            </button>

                            <button type="button" onClick={storePriceInDB}>
                                לשמור מוצר
                            </button>
                        </div>
                    </form>
                </div>

                <div className="details-container">
                    {showDetails && totalPrice && (
                        <div className="calculation-details">
                            <h3>Calculation Details</h3>
                            <p>Gold Type: {selectedGoldType}</p>
                            <p>Stone Price: {stonePrice} ILS</p>
                            <p>Weight: {weight} grams</p>
                            <p>Setting Price: {settingPrice} ILS</p>
                            <p>Extra Cost: {extraCost} ILS</p>
                            <p>Print Cost: {printCost} ILS</p>
                            <p>Fixed Price: {fixPrice} ILS</p>
                            <p>Work Time Cost: {workTimeCost} {selectedCurrency}</p>
                            <p>Total Price: {totalPrice} {selectedCurrency}</p>
                            <p>Price for Customer: {priceForCustomer} {selectedCurrency}</p>
                        </div>
                    )}
                </div>

                <div className="table-container">
                    <JewelryTable jewelryData={jewelryData} />
                </div>
            </div>
        </div>
    );
}

export default JewelryCalculator;
