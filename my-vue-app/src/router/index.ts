import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/studyBySelf/welcome',
    },
    {
        path: '/studyBySelf',
        redirect: '/studyBySelf/welcome',
        children: [
            {
                path: 'welcome',
                component: () => import('../pages/studyBySelf/HelloWorld.vue')
            },
            {
                path: 'hello',
                component: () => import('../pages/studyBySelf/hello.vue')
            },
            {
                path: 'computed',
                component: () => import('../pages/studyBySelf/computed.vue')
            },
            {
                path: 'parentsCom',
                component: () => import('../pages/studyBySelf/parentsCom.vue')
            },
            {
                path: 'reactive',
                component: () => import('../pages/studyBySelf/reactive.vue')
            },
            {
                path: 'setup',
                component: () => import('../pages/studyBySelf/setup.vue')
            },
            {
                path: 'watch',
                component: () => import('../pages/studyBySelf/watch.vue')
            },
            {
                path: 'hook',
                component: () => import('../pages/studyBySelf/hook.vue')
            },
            {
                path: 'ref-focus',
                component: () => import('../pages/studyBySelf/ref-focus.vue')
            },
            {
                path: 'shallowReactive-shallowRef',
                component: () => import('../pages/studyBySelf/shallowReactive-shallowRef.vue')
            },
            {
                path: 'readonly-shallowReadonly',
                component: () => import('../pages/studyBySelf/readonly-shallowReadonly.vue')
            },
            {
                path: 'toRef',
                component: () => import('../pages/studyBySelf/toRef.vue')
            },
            {
                path: 'customRef',
                component: () => import('../pages/studyBySelf/customRef.vue')
            },
            {
                path: 'provide-inject',
                component: () => import('../pages/studyBySelf/provide-inject.vue')
            },
            {
                path: 'axios',
                component: () => import('../pages/studyBySelf/axios.vue')
            },
            {
                path: 'FloatingPanel',
                component: () => import('../pages/studyBySelf/FloatingPanel.vue')
            },
        ]
    },
    {
        path: '/2048',
        component: () => import('../pages/game/2048.vue')
    },
    {
        path: '/2048_original',
        component: () => import('../pages/game/2048_original.vue')
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
