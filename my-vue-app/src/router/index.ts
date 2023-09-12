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
            },{
                path:'Teleport',
                component:()=>import('../components/Teleport.vue')
            },{
                path:'axios',
                component:()=>import('../components/axios.vue')
            }
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
