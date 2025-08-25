import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { gql } from 'graphql-tag';

const typeDefs = gql`
  type Warehouse {
    code: ID!
    name: String!
    city: String!
    country: String!
  }

  type Product {
    id: ID!
    name: String!
    sku: String!
    warehouse: String!
    stock: Int!
    demand: Int!
  }

  type KPI {
    date: String!
    stock: Int!
    demand: Int!
  }

  type Query {
    products(search: String, status: String, warehouse: String): [Product!]!
    warehouses: [Warehouse!]!
    kpis(range: String!): [KPI!]!
  }

  type Mutation {
    updateDemand(id: ID!, demand: Int!): Product!
    transferStock(id: ID!, from: String!, to: String!, qty: Int!): Product!
  }
`;

// Mock data
const warehouses = [
  { code: 'BLR-A', name: 'Bangalore Central', city: 'Bangalore', country: 'India' },
  { code: 'PNQ-C', name: 'Pune North', city: 'Pune', country: 'India' },
  { code: 'DEL-B', name: 'Delhi West', city: 'Delhi', country: 'India' },
];

let products = [
  { id: 'P-1001', name: '12mm Hex Bolt', sku: 'HEX-12-100', warehouse: 'BLR-A', stock: 180, demand: 120 },
  { id: 'P-1002', name: 'Steel Washer', sku: 'WSR-08-500', warehouse: 'BLR-A', stock: 50, demand: 80 },
  { id: 'P-1003', name: 'M8 Nut', sku: 'NUT-08-200', warehouse: 'PNQ-C', stock: 80, demand: 80 },
  { id: 'P-1004', name: 'Bearing 608ZZ', sku: 'BRG-608-50', warehouse: 'DEL-B', stock: 24, demand: 120 },
];

// Generate KPI data for the last 30 days
const generateKPIs = (range) => {
  const days = range === '7d' ? 7 : range === '14d' ? 14 : 30;
  const kpis = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Generate realistic stock and demand data
    const baseStock = 1000;
    const baseDemand = 800;
    const stockVariation = Math.floor(Math.random() * 200) - 100;
    const demandVariation = Math.floor(Math.random() * 150) - 75;
    
    kpis.push({
      date: date.toISOString().split('T')[0],
      stock: Math.max(0, baseStock + stockVariation),
      demand: Math.max(0, baseDemand + demandVariation),
    });
  }
  
  return kpis;
};

const resolvers = {
  Query: {
    products: (_, { search, status, warehouse }) => {
      let filteredProducts = [...products];
      
      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchLower) ||
          product.sku.toLowerCase().includes(searchLower) ||
          product.id.toLowerCase().includes(searchLower)
        );
      }
      
      if (warehouse) {
        filteredProducts = filteredProducts.filter(product =>
          product.warehouse === warehouse
        );
      }
      
      if (status) {
        filteredProducts = filteredProducts.filter(product => {
          if (status === 'Healthy') return product.stock > product.demand;
          if (status === 'Low') return product.stock === product.demand;
          if (status === 'Critical') return product.stock < product.demand;
          return true;
        });
      }
      
      return filteredProducts;
    },
    
    warehouses: () => warehouses,
    
    kpis: (_, { range }) => generateKPIs(range),
  },
  
  Mutation: {
    updateDemand: (_, { id, demand }) => {
      const product = products.find(p => p.id === id);
      if (!product) {
        throw new Error('Product not found');
      }
      
      product.demand = demand;
      return product;
    },
    
    transferStock: (_, { id, from, to, qty }) => {
      const product = products.find(p => p.id === id);
      if (!product) {
        throw new Error('Product not found');
      }
      
      if (product.warehouse !== from) {
        throw new Error('Product not in source warehouse');
      }
      
      if (product.stock < qty) {
        throw new Error('Insufficient stock');
      }
      
      product.stock -= qty;
      product.warehouse = to;
      
      return product;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app = express();
const PORT = 4000;

await server.start();

app.use(cors());
app.use(express.json());
app.use('/graphql', expressMiddleware(server));

app.listen(PORT, () => {
  console.log(`🚀 GraphQL server ready at http://localhost:${PORT}/graphql`);
});
