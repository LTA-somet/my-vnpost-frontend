
import { PageContainer } from "@ant-design/pro-layout";
import { Layout, Menu } from "antd";
import { useMemo } from "react";
import { useHistory, useIntl, useLocation } from "umi";
import routes from '../../../../config/routes';
import './style.css';

const { Sider } = Layout;

export default (props: any) => {
    const history = useHistory();
    const intl = useIntl();
    const location = useLocation();
    const menuSetting = useMemo(() => {
        const settingMenu: any[] = routes.find(r => r.name === 'setting')?.routes || [];
        let accountMenu: any[] = settingMenu.find(r => r.name === 'for-control')?.routes || [];
        accountMenu = accountMenu.filter(r => !r.hideInSubMenu);
        return accountMenu;
    }, []);
    const onClickMenu = (path: string) => {
        history.push(path)
    }
    const defaultSelectedKey = menuSetting.find((r: any) => r.path === location.pathname)?.name;
    return (
        <>
            <PageContainer>
                <Layout>
                    <Sider style={{ height: '100%' }} width={250}>
                        {/* {JSON.stringify(menuSetting)} */}
                        <Menu theme="light" mode="inline" defaultSelectedKeys={[defaultSelectedKey]}>
                            {
                                menuSetting?.map(menu => (
                                    <Menu.Item key={menu.name} onClick={() => onClickMenu(menu.path!)}>
                                        {intl.formatMessage({
                                            id: 'menu.setting.ticket.' + menu.name,
                                            defaultMessage: `${menu.name}`,
                                        })}
                                    </Menu.Item>
                                ))
                            }
                        </Menu>
                    </Sider>
                    <Layout style={{ marginLeft: 14 }}>
                        {props.children}
                    </Layout>
                </Layout>
            </PageContainer>
        </>
    )
}

