import { getAccountInfo, getMenuAccept } from '@/core/selectors';

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function (initialState: any) {
  // const { currentUser } = initialState || {};
  const accountInfo = getAccountInfo(initialState);
  const menuAccept = getMenuAccept(initialState);
  const menuCodes = menuAccept
    .map((m) => m.menuCode)
    .map((m) => {
      const index = m.lastIndexOf('__');
      return m.slice(index === -1 ? 0 : index + 2);
    });

  return {
    // canAccessMenu: () => true,
    canAccessMenu: (menu: any) => {
      const key = (menu.code || menu.name).replaceAll('-', '_').toUpperCase();
      return !!accountInfo && menuCodes?.some((rd) => rd === key);
    },
    canAccess: (key: string) => accountInfo && menuAccept?.some((rd) => rd.menuCode === key),
  };
}
