import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import tags from "@/views/tags";
import {getCache} from "@/assets/js/storageUtils";


const getUid = () => {
    const config = getCache('config');
    return config.uid;
}

export const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/myBookmark',
        name: '我的收藏',
        redirect: `/user/${getUid()}/bookmark/1`,
    },
    {
        path: '/search1',
        name: '搜索',
        redirect: `/search`,
    },
    {
        path: '/discovery',
        name: '发现',
        component: () => import('../views/discovery.vue')
    },
    {
        path: '/follow-latest',
        name: '关注作品',
        redirect: '/follow-latest/1'
    },
    {
        path: '/config',
        name: '配置',
        component: () => import('../views/config.vue')
    },
    {
        path: '/tags',
        name: '标签管理',
        component: tags
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
    {
        path: '/search',
        component: () => import('../views/search.vue'),
        children: [
            {
                path: ":keyword/:page",
                component: () => import('../views/searchTab.vue'),
            }
        ]
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
