// src/router/views FrontStages
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import AboutUsPage from '../views/AboutUsPage.vue';
import ShopCart from '../views/ShopCart.vue';
import ProductsList from '../views/ProductsList.vue';
import MembersPage from '../views/MembersPage.vue';
import ContactUs from '../views/ContactUs.vue';
import SearchResults from '../views/SearchResults.vue';
import UserRegister from '../views/UserRegister.vue';
import UserLogin from '../views/UserLogin.vue';
import ForgotPwd from '../views/ForgotPwd.vue';


// src/router/view/admin BackStages
import AdminDashboard from '../views/admin/AdminDashBoard.vue';
import AdminProducts from '../views/admin/AdminProduct.vue';
import AdminUsers from '../views/admin/AdminUsers.vue';
import AdminOrders from '../views/admin/AdminOrders.vue';
import CreateProduct from '../views/admin/CreateProduct.vue';
import EditProduct from '../views/admin/EditProduct.vue';
import AdminContact from '../views/admin/AdminContact.vue';
import OrderDetail from '../views/admin/OrderDetail.vue';
import CarouselImages from '../views/admin/CarouselImages.vue';
import SpecialOffers from '../views/admin/SpecialOffers.vue';



    const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: HomePage
    },
    {
        path: '/admin',
        name: 'AdminDashboard',
        component: AdminDashboard,
        // meta:{requiresAuth: true,role:'admin'}
    },
    {
        path: '/admin/Products',
        name: 'AdminProducts',
        component: AdminProducts,
        // meta:{requiresAuth: true,role:'admin'}
    },
    {
        path: '/admin/Users',
        name: 'AdminUsers',
        component: AdminUsers,
        // meta:{requiresAuth: true,role:'admin'}

    },
    {
        path: '/admin/Orders',
        name: 'AdminOrders',
        component: AdminOrders,
        // meta:{requiresAuth: true,role:'admin'}
    },    
    {
        path: '/admin/Orders/:id(\\d+)',
        name: 'OrderDetail',
        component: OrderDetail,
        props:true,
    },
    {
        path: '/admin/CreateProduct',
        name: 'CreateProduct',
        component: CreateProduct,
        // meta:{requiresAuth: true,role:'admin'}
    },
    {
        path: '/admin/EditProduct',
        name: 'EditProduct',
        component: EditProduct,
        // meta:{requiresAuth: true,role:'admin'}
    },
    {
        path: '/admin/AdminContact',
        name: 'AdminContact',
        component: AdminContact
    },
    {
        path: '/admin/CarouselImages',
        name: 'CarouselImages',
        component: CarouselImages
    },
    {
        path: '/admin/SpecialOffers',
        name: 'SpecialOffers',
        component: SpecialOffers
    },
    
    {
        path: '/ShopCart',
        name: 'ShopCart',
        component: ShopCart,
        meta:{requiresAuth: true}

    },
    {
        path: '/ProductsList',
        name: 'ProductsList',
        component: ProductsList
    },
    {
        path: '/MembersPage',
        name: 'MembersPage',
        component: MembersPage,
        meta:{requiresAuth: true}
    },
    {
        path: '/AboutUsPage',
        name: 'AboutUsPage',
        component: AboutUsPage
    },
    {
        path: '/ContactUs',
        name: 'ContactUs',
        component: ContactUs
    },
    {
        path: '/SearchResults',
        name: 'SearchResults',
        component: SearchResults
    },
    {
        path: '/UserRegister',
        name: 'UserRegister',
        component: UserRegister
    },
    {
        path: '/UserLogin',
        name: 'UserLogin',
        component: UserLogin
    },
    {
        path: '/ForgotPwd',
        name: 'ForgotPwd',
        component: ForgotPwd
    }


  // Add more routes as needed
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    });
    router.beforeEach((to,from,next)=>{
        const isLoggedIn = !!localStorage.getItem('authToken'); //檢查是某有登入
        const userRole = localStorage.getItem('role');

        if(to.matched.some(record => record.meta.requiresAuth)){
            // 如果頁面需要登入
            if(!isLoggedIn){
                // 未登入將導向登入頁面
                alert('請先登入再使用！')
                next({path:'/UserLogin',});
            }else if(to.meta.role && to.meta.role !== userRole){
                //使用者角色沒有權限
                alert('你沒有權限進入此頁面');
                next({path:'/'});
            }else{
                next();
            }
        }
        else{
            next();
        }
    });
    export default router;
    