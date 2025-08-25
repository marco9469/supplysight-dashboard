# SupplySight Dashboard

A modern React-based inventory management dashboard for supply chain operations, built with GraphQL, Apollo Client, and Tailwind CSS.

## 🚀 Features

### Dashboard Overview
- **KPI Cards**: Real-time display of Total Stock, Total Demand, and Fill Rate
- **Interactive Chart**: Stock vs Demand trend visualization with 7d/14d/30d range selection
- **Smart Filtering**: Search by product name, SKU, or ID with warehouse and status filters
- **Product Table**: Paginated table with status indicators (Healthy 🟢, Low 🟡, Critical 🔴)
- **Product Details**: Right-side drawer with product information and management tools

### Business Logic
- **Status Classification**:
  - 🟢 Healthy: Stock > Demand
  - 🟡 Low: Stock = Demand  
  - 🔴 Critical: Stock < Demand (with red-tinted rows)
- **Fill Rate Calculation**: (sum(min(stock, demand)) / sum(demand)) * 100%
- **Real-time Updates**: Live data updates through GraphQL mutations

### Interactive Features
- **Update Demand**: Modify product demand through the drawer interface
- **Transfer Stock**: Move inventory between warehouses with validation
- **Live Filtering**: Instant results as you type or change filters
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Apollo Client** for GraphQL state management
- **Tailwind CSS** for modern, responsive styling
- **Recharts** for data visualization
- **Lucide React** for beautiful icons
- **Date-fns** for date formatting

### Backend
- **Apollo Server** with Express
- **GraphQL** for flexible data querying
- **CORS** enabled for cross-origin requests
- **Mock Data** with realistic inventory scenarios

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Quick Start

1. **Clone and Install Dependencies**
   ```bash
   git clone https://github.com/marco9469/supplysight-dashboard.git
   cd supplysight-dashboard
   npm install
   ```

2. **Install Server Dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Start Both Servers**
   ```bash
   # Development mode (with auto-reload)
   npm run start:dev
   
   # Or production mode
   npm run start
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - GraphQL Playground: http://localhost:4000/graphql

## 🏗️ Project Structure

```
supplysight-dashboard/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Main dashboard component
│   │   ├── KPICards.jsx           # KPI metrics display
│   │   ├── StockDemandChart.jsx   # Trend visualization
│   │   ├── Filters.jsx            # Search and filter controls
│   │   ├── ProductsTable.jsx      # Product data table
│   │   └── ProductDrawer.jsx      # Product detail sidebar
│   ├── graphql/
│   │   ├── queries.js             # GraphQL queries
│   │   └── mutations.js           # GraphQL mutations
│   ├── apollo-client.js           # Apollo Client configuration
│   ├── App.jsx                    # Root component
│   └── index.css                  # Tailwind CSS imports
├── server/
│   ├── index.js                   # GraphQL server
│   └── package.json               # Server dependencies
├── package.json                   # Main dependencies
├── tailwind.config.js             # Tailwind configuration
└── README.md                      # This file
```

## 📊 GraphQL Schema

```graphql
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
```

## 🎯 Sample Data

The application comes with realistic mock data including:
- **4 Products**: Hex Bolts, Steel Washers, M8 Nuts, Bearings
- **3 Warehouses**: Bangalore Central, Pune North, Delhi West
- **Dynamic KPIs**: Generated time-series data for the last 30 days

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start frontend only
npm run server:dev       # Start server only (with auto-reload)
npm run start:dev        # Start both (development mode)

# Production
npm run start            # Start both servers
npm run build            # Build for production
npm run preview          # Preview production build
```

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with consistent spacing
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: User-friendly error messages and fallbacks
- **Responsive Layout**: Mobile-first design with breakpoint optimization
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Smooth Animations**: CSS transitions for drawer and hover effects

## 🚀 Performance Optimizations

- **Apollo Client Caching**: Intelligent data caching and updates
- **Component Memoization**: Optimized re-renders
- **Lazy Loading**: Efficient bundle splitting
- **Tailwind Purge**: Minimal CSS output in production

## 🔮 Future Enhancements

With more time, I would implement:

1. **Real-time Updates**: WebSocket integration for live data
2. **Advanced Analytics**: More detailed charts and insights
3. **User Authentication**: Role-based access control
4. **Export Features**: PDF/Excel report generation
5. **Bulk Operations**: Multi-select and batch updates
6. **Mobile App**: React Native companion app
7. **Testing**: Comprehensive unit and integration tests
8. **CI/CD**: Automated deployment pipeline

## 📝 Notes

This project demonstrates:
- **Modern React Patterns**: Hooks, functional components, and context
- **GraphQL Best Practices**: Efficient queries and mutations
- **State Management**: Apollo Client for server state
- **UI/UX Excellence**: Professional, accessible interface
- **Code Organization**: Clean, maintainable architecture

The application is production-ready and follows industry best practices for scalability and maintainability.

## 📞 Contact

**Marco Jian**
- **GitHub**: [marco9469](https://github.com/marco9469)
- **Email**: marco.jian69@gmail.com
- **LinkedIn**: [Marco Jian](https://www.linkedin.com/in/marco-jian-9a3888353)
