# 2Data - Software License Management Dashboard

A comprehensive full-stack web application for managing and optimizing enterprise software licenses across multiple vendors (Microsoft, SAP, Oracle, Salesforce, IBM).

## 🌟 Features

- **📊 Interactive Dashboard**: Real-time analytics with cost trends, license distribution, and savings visualization
- **📝 License Inventory**: Complete license tracking with search, filters, and management capabilities
- **⚡ Vendor Optimization**: Identify savings opportunities by vendor with AI-powered recommendations
- **📈 Advanced Analytics**: ROI analysis, cost savings trends, and vendor performance comparison
- **🛡️ Audit Risk Assessment**: Compliance scoring, risk tracking, and audit readiness checklist
- **🌙 Dark Mode**: Premium UI with seamless light/dark theme switching
- **📱 Responsive Design**: Works flawlessly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React** 18+ with Vite
- **React Router** for navigation
- **Chart.js** with react-chartjs-2 for data visualization
- **Axios** for API communication
- **Modern CSS** with custom design system

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ORM
- **RESTful API** architecture
- **CORS** enabled for cross-origin requests

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud instance)
- Git

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update .env with your MongoDB connection string
# MONGODB_URI=your_mongodb_connection_string

# Start backend server
npm start

# Or use nodemon for development
npm run dev
```

## 🚀 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Backend (Vercel)

1. Add `vercel.json` configuration (already included)
2. Set environment variables in Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: production
3. Deploy backend as serverless functions

**Note**: For production, use MongoDB Atlas (free tier available) instead of local MongoDB.

## 📁 Project Structure

```
2data/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── LicenseInventory.jsx
│   │   ├── VendorOptimization.jsx
│   │   ├── Analytics.jsx
│   │   ├── AuditRisk.jsx
│   │   └── Header.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── backend/
│   ├── models/
│   │   ├── License.model.js
│   │   └── Vendor.model.js
│   ├── routes/
│   │   ├── license.routes.js
│   │   └── analytics.routes.js
│   ├── server.js
│   └── .env
├── index.html
├── package.json
└── vite.config.js
```

## 🔌 API Endpoints

### Licenses
- `GET /api/licenses` - Get all licenses
- `GET /api/licenses/:id` - Get license by ID
- `GET /api/licenses/vendor/:vendor` - Get licenses by vendor
- `POST /api/licenses` - Create new license
- `PUT /api/licenses/:id` - Update license
- `DELETE /api/licenses/:id` - Delete license

### Analytics
- `GET /api/analytics/cost-summary` - Get cost summary statistics
- `GET /api/analytics/usage-trends` - Get usage trends by vendor
- `GET /api/analytics/vendor-comparison` - Compare vendor performance
- `GET /api/analytics/optimization-opportunities` - Get optimization suggestions

## 🎨 Design Features

- **Premium Aesthetics**: Vibrant gradients, glassmorphism, smooth animations
- **Modern Typography**: Inter font family for clean, professional look
- **Responsive Grid**: Adapts seamlessly to all screen sizes
- **Accessibility**: Semantic HTML, proper contrast ratios, keyboard navigation
- **Performance**: Optimized bundle size, lazy loading, efficient rendering

## 🧪 Testing

Access the application:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000/api

Test API health:
```bash
curl http://localhost:5000/api/health
```

## 📝 License

MIT License - feel free to use this project for your portfolio or commercial purposes.

## 👨‍💻 Author

Created as a demonstration application for 2-Data.com showcasing modern web development practices and enterprise software license management capabilities.

## 🤝 Contributing

This is a portfolio project, but suggestions and improvements are welcome!

---

**Built with ❤️ using React, Node.js, and MongoDB**
