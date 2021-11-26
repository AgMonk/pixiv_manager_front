import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import tags from "@/views/tags";

export const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/follow-latest',
        name: '关注作品',
        redirect: '/follow-latest/1'
    },
    {
        path: '/tags',
        name: '标签管理',
        component: tags
    },
    {
        path: '/config',
        name: '配置',
        component: () => import('../views/config.vue')
    },

]

const hiddenRoute = [
    {
        path: '/artwork/:pid',
        name: '作品详情',
        component: () => import('../views/artwork.vue')
    },

    {
        path: '/follow-latest/:page',
        component: () => import('../views/followLatest.vue')
    },
    {
        path: '/user/:userId/:type/:page',
        component: () => import('../views/userIllustManga.vue')
    },

]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
        ...routes,
        ...hiddenRoute,
    ]
})

export default router
