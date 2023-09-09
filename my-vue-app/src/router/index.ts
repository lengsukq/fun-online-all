import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        children: [
            {
                path: 'welcome',
                component: () => import('../components/HelloWorld.vue')
            },
            {
                path: 'hello',
                component: () => import('../components/hello.vue')
            },
            {
                path: 'computed',
                component: () => import('../components/computed.vue')
            },
            {
                path: 'parentsCom',
                component: () => import('../components/parentsCom.vue')
            },
            {
                path: 'reactive',
                component: () => import('../components/reactive.vue')
            },
            {
                path: 'setup',
                component: () => import('../components/setup.vue')
            }
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
