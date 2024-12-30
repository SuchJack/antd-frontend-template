export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
    ],
  },
  { path: '/welcome', icon: 'smile', component: './Welcome', name: '欢迎页' },
  {
    path: '/test/file',
    icon: 'file',
    component: './Test/File',
    name: '文件上传下载测试',
  },
  {
    path: '/templates/module',
    icon: 'home',
    component: './Templates/ModuleDemo',
    name: '封装的模块测试',
  },
  {
    path: '/post',
    icon: 'table',
    component: './Post/Index',
    name: '论坛文章',
  },
  {
    path: '/post/detail/:id',
    icon: 'table',
    component: './Post/Detail',
    name: '文章详情',
    hideInMenu: true,
  },
  {
    path: '/post/editor/:id',
    icon: 'table',
    component: './Post/Editor',
    name: '文章编辑',
    hideInMenu: true,
  },
  {
    path: '/admin',
    icon: 'crown',
    name: '管理页',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/user' },
      { icon: 'table', path: '/admin/user', component: './Admin/User', name: '用户管理' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
