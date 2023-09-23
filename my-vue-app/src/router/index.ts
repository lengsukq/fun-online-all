import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect:'/chat',
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
            },
            {
                path: 'watch',
                component: () => import('../components/watch.vue')
            },
            {
                path: 'hook',
                component: () => import('../components/hook.vue')
            },
            {
                path: 'ref-focus',
                component: () => import('../components/ref-focus.vue')
            },
            {
                path: 'shallowReactive-shallowRef',
                component: () => import('../components/shallowReactive-shallowRef.vue')
            },
            {
                path: 'readonly-shallowReadonly',
                component: () => import('../components/readonly-shallowReadonly.vue')
            },
            {
                path: 'toRef',
                component: () => import('../components/toRef.vue')
            },
            {
                path: 'customRef',
                component: () => import('../components/customRef.vue')
            },
            {
                path: 'provide-inject',
                component: () => import('../components/provide-inject.vue')
            },  {
                path: 'axios',
                component: () => import('../components/axios.vue')
            },
        ]
    },
    {
        path: '/2048',
        component: () => import('../pages/Game.vue')
    },
    {
        path: '/game',
        component: () => import('../pages/Game-yuan.vue')
    },
    {
        path: '/chat',
        component: () => import('../pages/chat.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
