import Mock from 'mockjs';
import setupMock from '@/utils/setupMock';

const menuTree = () => {
  return [
    {
        name: 'menu.dashboard',
        key: 'dashboard',
        children: [
        {
            name: 'menu.dashboard.workplace',
            key: 'dashboard/workplace',
        },
        ],
    },
    {
        name: 'Example',
        key: 'example',
    },
  ]
};

setupMock({
  setup: () => {
    Mock.mock(new RegExp('/api/menu/tree'), () => {
      return menuTree();
    });
  },
});
