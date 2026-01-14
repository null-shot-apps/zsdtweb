'use client';

import { useState } from 'react';

type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  category: string;
  location: string;
};

export default function InventoryManager() {
  const [items, setItems] = useState<InventoryItem[]>([
    { id: '1', name: 'Laptop Dell XPS 15', sku: 'TECH-001', quantity: 15, price: 1299.99, category: 'Electronics', location: 'Warehouse A' },
    { id: '2', name: 'Office Chair Ergonomic', sku: 'FURN-045', quantity: 42, price: 249.99, category: 'Furniture', location: 'Warehouse B' },
    { id: '3', name: 'Wireless Mouse', sku: 'TECH-089', quantity: 8, price: 29.99, category: 'Electronics', location: 'Warehouse A' },
    { id: '4', name: 'Standing Desk', sku: 'FURN-012', quantity: 23, price: 599.99, category: 'Furniture', location: 'Warehouse B' },
    { id: '5', name: 'USB-C Cable 2m', sku: 'ACC-234', quantity: 150, price: 12.99, category: 'Accessories', location: 'Warehouse C' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', sku: '', quantity: 0, price: 0, category: '', location: ''
  });

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      ...formData
    };
    setItems([...items, newItem]);
    setFormData({ name: '', sku: '', quantity: 0, price: 0, category: '', location: '' });
    setShowAddForm(false);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setFormData({ name: item.name, sku: item.sku, quantity: item.quantity, price: item.price, category: item.category, location: item.location });
  };

  const handleUpdate = () => {
    setItems(items.map(item => item.id === editingId ? { ...item, ...formData } : item));
    setEditingId(null);
    setFormData({ name: '', sku: '', quantity: 0, price: 0, category: '', location: '' });
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = items.filter(item => item.quantity < 20).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Business Inventory</h1>
          <p className="text-slate-400">Manage and track all your inventory items</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
            <div className="text-slate-400 text-sm mb-1">Total Items</div>
            <div className="text-3xl font-bold">{totalItems}</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
            <div className="text-slate-400 text-sm mb-1">Total Value</div>
            <div className="text-3xl font-bold">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6">
            <div className="text-slate-400 text-sm mb-1">Low Stock Alerts</div>
            <div className="text-3xl font-bold text-amber-400">{lowStockItems}</div>
          </div>
        </div>

        {/* Search and Add */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name, SKU, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {showAddForm ? 'Cancel' : '+ Add Item'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingId) && (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Item' : 'Add New Item'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Item Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-900/50 border border-slate-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="SKU"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="bg-slate-900/50 border border-slate-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={formData.quantity || ''}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                className="bg-slate-900/50 border border-slate-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="bg-slate-900/50 border border-slate-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="bg-slate-900/50 border border-slate-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-slate-900/50 border border-slate-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={editingId ? handleUpdate : handleAdd}
                className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingId(null);
                  setFormData({ name: '', sku: '', quantity: 0, price: 0, category: '', location: '' });
                }}
                className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Inventory Table */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold">Item Name</th>
                  <th className="text-left px-6 py-4 font-semibold">SKU</th>
                  <th className="text-left px-6 py-4 font-semibold">Quantity</th>
                  <th className="text-left px-6 py-4 font-semibold">Price</th>
                  <th className="text-left px-6 py-4 font-semibold">Category</th>
                  <th className="text-left px-6 py-4 font-semibold">Location</th>
                  <th className="text-left px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-t border-slate-700 hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">{item.name}</td>
                    <td className="px-6 py-4 text-slate-400">{item.sku}</td>
                    <td className="px-6 py-4">
                      <span className={`${item.quantity < 20 ? 'text-amber-400 font-semibold' : ''}`}>
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{item.location}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-400 hover:text-red-300 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              No items found. Try adjusting your search or add a new item.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

