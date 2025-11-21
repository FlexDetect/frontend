import React from 'react';
import { Layout, Menu, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../services/auth';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const Landing = () => {
  const navigate = useNavigate();
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#004080',
          padding: '0 24px',
        }}
      >
        <div style={{ color: '#fff', fontWeight: 'bold', fontSize: 24 }}>
          FlexDetect
        </div>

        {isLoggedIn() ? (
          <Button
            type="primary"
            style={{ backgroundColor: '#fadb14', borderColor: '#fadb14', color: '#004080' }}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>
        ) : (
          <Button
            type="primary"
            style={{ backgroundColor: '#fadb14', borderColor: '#fadb14', color: '#004080' }}
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        )}
      </Header>

      <Content
        style={{
          padding: '80px 50px',
          backgroundImage: 'url(/solar_buildings.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          color: '#e0e7ff',
          minHeight: 'calc(100vh - 134px)',
        }}
      >
        {/* Overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 40, 0.6)',
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: 'relative',
            maxWidth: 800,
            margin: '0 auto',
            textAlign: 'center',
            zIndex: 2,
          }}
        >
          <Title level={1} style={{ fontWeight: 'bold', color: '#ffffffff' }}>
            Detecting Energy Flexibility in Buildings
          </Title>
          <Paragraph style={{ fontSize: 18, lineHeight: 1.6, color: '#e3e4e7ff' }}>
            Monitor and optimize energy usage in your buildings with FlexDetect.  
            Our platform helps you detect and adapt energy consumption patterns  
            for a smarter, sustainable future.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            style={{ backgroundColor: '#fadb14', borderColor: '#fadb14', color: '#004080' }}
          >
            Get Started
          </Button>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', backgroundColor: '#004080', color: '#fff' }}>
        © 2025 FlexDetect. Aljaž Brodar.
      </Footer>
    </Layout>
  );
};

export default Landing;
