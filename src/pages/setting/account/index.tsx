import { PageContainer } from "@ant-design/pro-layout";
import { Button } from "antd";
import { useMemo } from "react";
import { Access, useAccess, useHistory, useIntl, useLocation } from "umi";
import routes from '../../../../config/routes';
import './style.css';
import * as AntdIcons from '@ant-design/icons';


export default (props: any) => {
    const history = useHistory();
    const intl = useIntl();
    const location = useLocation();
    const access = useAccess();

    const menuSetting = useMemo(() => {
        const settingMenu: any[] = routes.find(r => r.name === 'setting')?.routes || [];
        let accountMenu: any[] = settingMenu.find(r => r.name === 'account')?.routes || [];
        accountMenu = accountMenu.filter(r => !r.hideInSubMenu);
        return accountMenu;
    }, []);
    const onClickMenu = (path: string) => {
        history.push(path)
    }
    // const defaultSelectedKey = menuSetting.find((r: any) => r.path === location.pathname)?.name;
    if (location.pathname.endsWith('setting/account')) {
        menuSetting.every(m => {
            if (access[m.access]?.(m)) {
                history.replace(m.path);
                return false;
            }
            return true;
        })
    }


    const menuList = useMemo(() => {
        return menuSetting.map(m => {
            const AntdIcon = AntdIcons[m.icon];
            return <Access
                accessible={access[m.access]?.(m)}
            >
                <Button className="ant-btn-setting-account button:disabled:hover"
                    key='employee-manager'
                    onClick={() => onClickMenu(m.path)}>
                    <span>
                        {AntdIcon && <AntdIcon style={{ color: '#004588', fontSize: '25px' }} />}
                        <p style={{ marginBottom: 0 }}>
                            {intl.formatMessage({
                                id: 'menu.setting.account.' + m.name,
                                defaultMessage: `${m.name}`,
                            })}
                        </p>
                    </span>
                </Button>
            </Access>
        })
    }, [menuSetting]);

    return (
        <>
            <PageContainer
                extra={menuList}
            >
                {props.children}
            </PageContainer>
        </>
    )
}
