import { createWebHistory, createRouter } from 'vue-router'
import SignUp from '@/components/SignUp'
import Dashboard from '@/components/Dashboard'
import SingleInvoice from '@/components/SingleInvoice'



const routes = [{
        path: '/',
        name: 'SignUp',
        component: SignUp
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard
    }, {
        path: '/invoice',
        name: 'SingleInvoice',
        component: SingleInvoice
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;