import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);

  const [inputValue, setInputValue] = useState('');

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items');

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const data = await response.json();
      setItems(data);

    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleAddItem = async () => {
    if (inputValue.trim() === '') return;

    const newItem = { name: inputValue };

    try {

      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const savedData = await response.json();

      fetchItems();
      setInputValue('');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

   return (
    <div className="App">
      <h1>React App with Node.js API</h1>

      <div className="input-section">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Novo item"
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>

      <h2>Items List</h2>
      {items.length === 0 ? (
        <p>Nenhum item encontrado. Adicione um!</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item._id || item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;