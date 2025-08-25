import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from '../apollo-client';
import KPICards from './KPICards';
import StockDemandChart from './StockDemandChart';
import Filters from './Filters';
import ProductsTable from './ProductsTable';
import ProductDrawer from './ProductDrawer';
import { format } from 'date-fns';

const Dashboard = () => {
  const [filters, setFilters] = useState({
    search: '',
    warehouse: '',
    status: '',
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProduct(null);
  };

  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">SupplySight</h1>
              </div>
              <div className="text-sm text-gray-600">
                {format(new Date(), 'EEEE, MMMM do, yyyy')}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* KPI Cards */}
          <KPICards />

          {/* Chart */}
          <StockDemandChart />

          {/* Filters */}
          <Filters filters={filters} onFilterChange={handleFilterChange} />

          {/* Products Table */}
          <ProductsTable filters={filters} onRowClick={handleRowClick} />
        </main>

        {/* Product Drawer */}
        <ProductDrawer
          product={selectedProduct}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
        />
      </div>
    </ApolloProvider>
  );
};

export default Dashboard;
