// backend/app.js
require('dotenv').config({ path: __dirname + '/.env' });
console.log('NODE_ENV in app.js:', process.env.NODE_ENV);
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// 初始化 Express 應用
const app = express();

// 環境變數配置
const PORT = process.env.PORT || 5002;
const NODE_ENV = process.env.NODE_ENV || 'development';

// 中介軟體配置
app.use(cors({
    origin: process.env.NODE_ENV === 'development' 
        ? ['http://localhost:8081']
        : process.env.ALLOWED_ORIGINS?.split(','),
    // origin: 'http://localhost:8081',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,        
}));
console.log(process.env.NODE_ENV);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 靜態資源配置
app.use('/api/static', express.static(path.join(__dirname, 'public','img')));
app.use('/img', express.static(path.join(__dirname, 'public', 'img'))); // 新增：將 /img 路徑指向 public/img
app.use('/static', express.static(path.join(__dirname, 'public'))); // 保留其他靜態資源

// app.use('/api/static/img', express.static(path.join(__dirname, 'public', 'img')));
// app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

// 路由配置
const routes = {
    brands: require('./routes/brandsRoutes'),
    carouselImages: require('./routes/carouselImagesRoutes'),
    orderItems: require('./routes/orderItemsRoutes'),
    orders: require('./routes/ordersRoutes'),
    products: require('./routes/productsRoutes'),
    recipients: require('./routes/recipientsRoutes'),
    sales: require('./routes/salesRoutes'),
    specialOffers: require('./routes/specialOffersRoutes'),
    tags: require('./routes/tagsRoutes'),
    users: require('./routes/usersRoutes'),
    ranking: require('./routes/rankingRoutes')
};

// 註冊路由（修改路由命名規則）
Object.entries(routes).forEach(([name, router]) => {
    const routePath = name.replace(/([A-Z])/g, '_$1').toLowerCase();
    app.use(`/api/${routePath}`, router);
});

// 檢查必要目錄
const ensureDirectories = () => {
    const dirs = [
        path.join(__dirname, 'public'),
        path.join(__dirname, 'public', 'img'),
        path.join(__dirname, 'dist')
    ];
    
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
};

// API 404 處理
app.use('/api', (req, res) => {
    res.status(404).json({ message: 'API 路徑未找到' });
});

// 全局錯誤處理
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || '內部伺服器錯誤';
    
    // 開發環境才輸出詳細錯誤
    if (process.env.NODE_ENV === 'development') {
        console.error('錯誤:', err);
    }
    
    res.status(status).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { error: err.stack })
    });
});

// 前端路由處理
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// 伺服器啟動函數
const startServer = async () => {
    try {
        ensureDirectories();
        
        // 測試資料庫連線
        const db = require('./config/db');
        await db.query('SELECT 1');
        
        // 檢查端口是否被占用
        const server = app.listen(PORT)
            .on('error', (err) => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`Port ${PORT} 已被占用，嘗試使用 ${PORT + 1}`);
                    server.close();
                    app.listen(PORT + 1);
                } else {
                    console.error('服務器��動錯誤:', err);
                    process.exit(1);
                }
            })
            .on('listening', () => {
                const actualPort = server.address().port;
                console.log(`
=================================
  伺服器啟動成功
  環境: ${NODE_ENV}
  端口: ${actualPort}
=================================`);
            });
    } catch (error) {
        console.error('伺服器啟動失敗:', error.message);
        process.exit(1);
    }
};

// 啟動伺服器
startServer();

module.exports = app;