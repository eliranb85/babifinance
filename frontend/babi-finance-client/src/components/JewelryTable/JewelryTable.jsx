import React, { useState, useEffect } from 'react';
import useToken from '../../useToken'; // Custom hook
import axios from 'axios';
import './JewelryTable.css';

function JewelryTable() {
    const [jewelryData, setJewelryData] = useState([]); 
    const [filteredData, setFilteredData] = useState([]); 
    const [hoveredItem, setHoveredItem] = useState(null); 
    const [searchTerm, setSearchTerm] = useState(''); 
    const [editingId, setEditingId] = useState(null); 
    const [editedPrice, setEditedPrice] = useState(''); 
    const [loading, setLoading] = useState(false); // For loading state
    const [error, setError] = useState(null); // For error state
    const token = useToken(); // Get token

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'; // Use environment variable for base URL

    useEffect(() => {
        fetchJewelryData(); 
    }, [token]); // Re-fetch data when token is updated

    const fetchJewelryData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/jewelryData`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Attach token
                },
            });
            setJewelryData(response.data || []); 
            setFilteredData(response.data || []); 
        } catch (error) {
            console.error('Error fetching jewelry data:', error.response ? error.response.data : error.message);
            setError('Failed to fetch jewelry data.');
        } finally {
            setLoading(false);
        }
    };

    const deleteEntry = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/jewelryData/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Attach token
                },
            });
            const updatedData = jewelryData.filter(item => item._id !== id);
            setFilteredData(updatedData); 
            setJewelryData(updatedData); 
        } catch (error) {
            console.error('Error deleting entry:', error.response ? error.response.data : error.message);
            setError('Failed to delete entry.');
        }
    };

    const deleteAllEntries = async () => {
        try {
            await axios.delete(`${API_BASE_URL}/api/jewelryData`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Attach token
                },
            });
            setFilteredData([]); 
            setJewelryData([]); 
        } catch (error) {
            console.error('Error deleting all entries:', error.response ? error.response.data : error.message);
            setError('Failed to delete all entries.');
        }
    };

    const handleEditClick = (id, currentPrice) => {
        setEditingId(id);
        setEditedPrice(currentPrice);
    };

    const handleSaveClick = async (id) => {
        try {
            await axios.put(`${API_BASE_URL}/api/jewelryData/${id}`, { priceForCustomer: editedPrice }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Attach token
                },
            });
            setEditingId(null); 
            const updatedData = filteredData.map(item =>
                item._id === id ? { ...item, priceForCustomer: editedPrice } : item
            );
            setFilteredData(updatedData);
            setJewelryData(updatedData); 
        } catch (error) {
            console.error('Error updating price:', error.response ? error.response.data : error.message);
            setError('Failed to update price.');
        }
    };

    useEffect(() => {
        const filtered = jewelryData.filter(item =>
            item.jewelryName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchTerm, jewelryData]);

    return (
        <div className="jewelry-table">
            <h3>טבלת פריטים</h3>

            {error && <p className="error-message">{error}</p>}
            {loading && <p>Loading...</p>} {/* Loading state */}

            {!loading && (
                <>
                    <button onClick={deleteAllEntries} className="delete-all-btn">
                        למחוק את כל הפריטים
                    </button>

                    <input
                        type="text"
                        placeholder="Search by Jewelry Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />

                    {filteredData.length > 0 ? (
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>שם</th>
                                        <th>זהב</th>
                                        <th>מטבע</th>
                                        <th>מחיר</th>
                                        <th>מחיר ללקוח</th>
                                        <th>תאריך</th>
                                        <th></th> 
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((entry) => (
                                        <tr key={entry._id} onMouseEnter={() => setHoveredItem(entry)} onMouseLeave={() => setHoveredItem(null)}>
                                            <td>{entry.jewelryName}</td>
                                            <td>{entry.selectedGoldType}</td>
                                            <td>{entry.selectedCurrency}</td>
                                            <td>{entry.totalPrice}</td>
                                            <td>
                                                {editingId === entry._id ? (
                                                    <input
                                                        type="number"
                                                        value={editedPrice}
                                                        onChange={(e) => setEditedPrice(e.target.value)}
                                                        onBlur={() => handleSaveClick(entry._id)} 
                                                    />
                                                ) : (
                                                    <span onClick={() => handleEditClick(entry._id, entry.priceForCustomer)}>
                                                        {entry.priceForCustomer}
                                                    </span>
                                                )}
                                            </td>
                                            <td>{new Date(entry.date).toLocaleString()}</td>
                                            <td>
                                                <button onClick={() => deleteEntry(entry._id)} className="delete-btn">
                                                    למחוק פריט
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {hoveredItem && (
                                <div className="popup">
                                    <h4>Calculation Details</h4>
                                    <p>Gold Type: {hoveredItem.selectedGoldType}</p>
                                    <p>Stone Price: {hoveredItem.stonePrice} ILS</p>
                                    <p>Weight: {hoveredItem.weight} grams</p>
                                    <p>Setting Price: {hoveredItem.settingPrice} ILS</p>
                                    <p>Extra Cost: {hoveredItem.extraCost} ILS</p>
                                    <p>Print Cost: {hoveredItem.printCost} ILS</p>
                                    <p>Fixed Price: {hoveredItem.fixPrice} ILS</p>
                                    <p>Work Time Cost: {hoveredItem.workTimeCost} {hoveredItem.selectedCurrency}</p>
                                    <p>Total Price: {hoveredItem.totalPrice} {hoveredItem.selectedCurrency}</p>
                                    <p>Price for Customer: {hoveredItem.priceForCustomer} {hoveredItem.selectedCurrency}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>No data available</p>
                    )}
                </>
            )}
        </div>
    );
}

export default JewelryTable;
