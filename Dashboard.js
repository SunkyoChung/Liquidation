/** @jsxImportSource @emotion/react */
import { jsx, css } from '@emotion/react';
import { useState } from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ReadOutlined,
  ProfileOutlined,
  DollarOutlined,
  RobotOutlined,
  TransactionOutlined,
  HistoryOutlined,
  SafetyCertificateOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { MenuPopover } from 'containers/AccountMenu/Menu';
import { NewProductModal } from 'containers/NewProduct/NewProductModal';
import { NewTransactionModal } from 'containers/TransactionForm/TransactionModal';
import { useAuth } from 'context/hooks';
import { Link, useLocation, Switch, Route } from 'react-router-dom';

import { TransactionProvider } from 'context/transactions';
import { ProductProvider } from '../../context/products';

import { BidProvider } from '../../context/bids';
import { Balance } from 'containers/Balance/Balance';

import { Transactions } from 'pages/Transactions/Transactions';
import { Commerce } from 'pages/Commerce/Commerce';
import { Posts } from 'pages/Posts/Posts';
import { Admin } from 'pages/Admin/Admin';
import { History } from 'pages/History/History';
import { Liquidation } from 'pages/Liquidation/Liquidation';

const { Header, Sider, Footer, Content } = Layout;

const TITLES_MAP = {
  ['/com']: 'Commerce',
  ['/posts']: 'Posts & Bids',
  ['/admin']: 'Admin Panel',
  ['/transactions']: 'Transactions',
  ['/his']: 'History',
  ['/liq']: 'Liquidation',
};

const styles = {
  buttonIcon: css({
    padding: '0 24px',
    fontSize: 18,
    cursor: 'pointer',
    transition: 'color 0.3s',
    '&:hover': {
      color: '#1890ff',
    },
  }),
  logo: css({
    height: 32,
    margin: 16,
    background: 'rgba(255, 255, 255, 0.3)',
  }),
  header: css({
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto auto auto',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  }),
  title: css({
    margin: '0 !important',
  }),
  content: css({
    display: 'grid',
    padding: '1em',
    gridTemplateColumns: '100%',
    alignContent: 'start',
    gap: '1em',
    overflowX: 'hidden',
    overflowY: 'auto',
  }),
  footer: css({
    borderTop: '0px',
    left: 0,
    bottom: 0,
    width: '100%',
    textAlign: "center"
  }),
};

function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const { pathname } = useLocation();
  const Icon = collapsed ? MenuUnfoldOutlined : MenuFoldOutlined;

  return (
    <ProductProvider>
      <BidProvider>
        <TransactionProvider>
          <Layout style={{ height: '100%', overflow: 'hidden' }}>
            <Layout>
              <Header css={styles.header} style={{ padding: 0 }}>
                <Icon
                  css={styles.buttonIcon}
                  onClick={() => setCollapsed(!collapsed)}
                />
                <Typography.Title css={styles.title} level={3}>
                  {TITLES_MAP[pathname]}
                </Typography.Title>

                <NewProductModal />
                <NewTransactionModal />
                <MenuPopover user={user}></MenuPopover>
              </Header>
              <Content css={styles.content}>
                {(!user.is_admin || pathname !== '/admin') && <Balance />}
                <Switch>
                  <Route exact path="/com">
                    <Commerce />
                  </Route>
                  <Route exact path="/posts">
                    <Posts />
                  </Route>
                  <Route exact path="/transactions">
                    <Transactions />
                  </Route>
                  <Route exact path="/his">
                    <History />
                  </Route>
                  <Route exact path="/liq">
                    <Liquidation />
                  </Route>
                  <Route exact path="/admin">
                    <Admin />
                  </Route>
                </Switch>
              </Content>
            </Layout>
            <Footer css={styles.footer} trigger={null} theme="dark" collapsible collapsed={collapsed}>
              <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[pathname]}>
                <Menu.Item key="/com" icon={<DollarOutlined />}>
                  <Link to="/com">Commerce</Link>
                </Menu.Item>

                <Menu.Item key="/posts" icon={<ProfileOutlined />}>
                  <Link to="/posts">Posts & Bids</Link>
                </Menu.Item>

                <Menu.Item key="/transactions" icon={<TransactionOutlined />}>
                  <Link to="/transactions">Transactions</Link>
                </Menu.Item>

                <Menu.Item key="/his" icon={<HistoryOutlined />}>
                  <Link to="/his">History</Link>
                </Menu.Item>

                <Menu.Item key="/liq" icon={<SafetyCertificateOutlined />}>
                  <Link to="/liq">Liquidation</Link>
                </Menu.Item>

                {user.is_admin && (
                  <Menu.Item key="/admin" icon={<RobotOutlined />}>
                    <Link to="/admin">Admin</Link>
                  </Menu.Item>
                )}
              </Menu>
            </Footer>
          </Layout>
        </TransactionProvider>
      </BidProvider>
    </ProductProvider>
  );
}

export { Dashboard };
