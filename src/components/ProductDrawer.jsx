import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_DEMAND, TRANSFER_STOCK } from '../graphql/mutations';
import { GET_WAREHOUSES } from '../graphql/queries';
import { X, Package, Edit, Truck } from 'lucide-react';

const ProductDrawer = ({ product, isOpen, onClose }) => {
  const [demandForm, setDemandForm] = useState({ demand: product?.demand || 0 });
  const [transferForm, setTransferForm] = useState({
    from: product?.warehouse || '',
    to: '',
    qty: 0,
  });
  const [activeTab, setActiveTab] = useState('details');

  const { data: warehousesData } = useQuery(GET_WAREHOUSES);
  const warehouses = warehousesData?.warehouses || [];

  const [updateDemand, { loading: updatingDemand }] = useMutation(UPDATE_DEMAND, {
    onCompleted: () => {
      alert('Demand updated successfully!');
      onClose();
    },
    onError: (error) => {
      alert(`Error updating demand: ${error.message}`);
    },
  });

  const [transferStock, { loading: transferringStock }] = useMutation(TRANSFER_STOCK, {
    onCompleted: () => {
      alert('Stock transferred successfully!');
      onClose();
    },
    onError: (error) => {
      alert(`Error transferring stock: ${error.message}`);
    },
  });

  const handleDemandSubmit = (e) => {
    e.preventDefault();
    updateDemand({
      variables: {
        id: product.id,
        demand: parseInt(demandForm.demand),
      },
    });
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    transferStock({
      variables: {
        id: product.id,
        from: transferForm.from,
        to: transferForm.to,
        qty: parseInt(transferForm.qty),
      },
    });
  };

  const getStatusInfo = (stock, demand) => {
    if (stock > demand) {
      return { status: 'Healthy', color: 'bg-green-100 text-green-800', icon: '🟢' };
    } else if (stock === demand) {
      return { status: 'Low', color: 'bg-yellow-100 text-yellow-800', icon: '🟡' };
    } else {
      return { status: 'Critical', color: 'bg-red-100 text-red-800', icon: '🔴' };
    }
  };

  if (!product) return null;

  const statusInfo = getStatusInfo(product.stock, product.demand);

  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Package className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Product Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === 'details'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('demand')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === 'demand'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Update Demand
            </button>
            <button
              onClick={() => setActiveTab('transfer')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === 'transfer'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Transfer Stock
            </button>
          </div>

          <div className="p-6">
            {/* Product Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.id}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">SKU</label>
                    <p className="text-sm text-gray-900 mt-1">{product.sku}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Warehouse</label>
                    <p className="text-sm text-gray-900 mt-1">{product.warehouse}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <p className="text-sm text-gray-900 mt-1">{product.stock.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Demand</label>
                    <p className="text-sm text-gray-900 mt-1">{product.demand.toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${statusInfo.color}`}>
                    <span className="mr-1">{statusInfo.icon}</span>
                    {statusInfo.status}
                  </span>
                </div>
              </div>
            )}

            {/* Update Demand Tab */}
            {activeTab === 'demand' && (
              <div className="space-y-4">
                <div className="flex items-center">
                  <Edit className="h-5 w-5 text-gray-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Update Demand</h3>
                </div>

                <form onSubmit={handleDemandSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Demand: {product.demand.toLocaleString()}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={demandForm.demand}
                      onChange={(e) => setDemandForm({ demand: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter new demand"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updatingDemand}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {updatingDemand ? 'Updating...' : 'Update Demand'}
                  </button>
                </form>
              </div>
            )}

            {/* Transfer Stock Tab */}
            {activeTab === 'transfer' && (
              <div className="space-y-4">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-gray-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Transfer Stock</h3>
                </div>

                <form onSubmit={handleTransferSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Warehouse
                    </label>
                    <input
                      type="text"
                      value={transferForm.from}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To Warehouse
                    </label>
                    <select
                      value={transferForm.to}
                      onChange={(e) => setTransferForm({ ...transferForm, to: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select warehouse</option>
                      {warehouses
                        .filter(w => w.code !== product.warehouse)
                        .map((warehouse) => (
                          <option key={warehouse.code} value={warehouse.code}>
                            {warehouse.name} ({warehouse.code})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity (Max: {product.stock})
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={transferForm.qty}
                      onChange={(e) => setTransferForm({ ...transferForm, qty: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter quantity"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={transferringStock || !transferForm.to || !transferForm.qty}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {transferringStock ? 'Transferring...' : 'Transfer Stock'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDrawer;
