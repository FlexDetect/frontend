import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Card,
  Select,
  Upload,
  message,
} from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  BarChartOutlined,
  SettingOutlined,
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
} from '@ant-design/icons';
import Navbar from './Navbar';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const facilityTypes = ['Office', 'Retail', 'Industrial', 'Mixed-use'];

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('facilities');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const [editingFacility, setEditingFacility] = useState(null);
  const [mlData, setMlData] = useState(null);

  const [form] = Form.useForm();

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  };

  const showModal = (facility = null) => {
    setEditingFacility(facility);
    if (facility) {
      form.setFieldsValue({
        name: facility.name,
        address: facility.address,
        gpsLat: facility.gpsLat,
        gpsLng: facility.gpsLng,
        type: facility.type,
        sizeSqm: facility.sizeSqm,
        floors: facility.floors,
        contactName: facility.contactName,
        contactPhone: facility.contactPhone,
        contactEmail: facility.contactEmail,
        mlDataJson: facility.mlDataJson || '',
      });
      setMlData(facility.mlDataJson || null);
    } else {
      form.resetFields();
      setMlData(null);
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingFacility(null);
    setMlData(null);
  };

  const handleAddOrEditFacility = (values) => {
    const facilityData = {
      ...values,
      mlDataJson: mlData,
    };
    if (editingFacility) {
      setFacilities((prev) =>
        prev.map((f) => (f.id === editingFacility.id ? { ...f, ...facilityData } : f))
      );
    } else {
      const newFacility = {
        id: Date.now(),
        ...facilityData,
      };
      setFacilities((prev) => [...prev, newFacility]);
    }
    setIsModalVisible(false);
    form.resetFields();
    setEditingFacility(null);
    setMlData(null);
  };

  const uploadProps = {
    accept: '.json,application/json',
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          setMlData(json);
          message.success('ML data loaded successfully');
        } catch {
          message.error('Invalid JSON file');
          setMlData(null);
        }
      };
      reader.readAsText(file);
      return false; // prevent upload
    },
    showUploadList: false,
  };

  const facilitiesContent = (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal(null)}
        style={{
          marginBottom: 24,
          backgroundColor: '#fadb14',
          borderColor: '#fadb14',
          color: '#004080',
        }}
      >
        Add New Facility
      </Button>

      <Row gutter={[24, 24]}>
        {facilities.length === 0 && (
          <Col span={24} style={{ textAlign: 'center', color: '#888' }}>
            No facilities added yet.
          </Col>
        )}
        {facilities.map((facility) => (
          <Col key={facility.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              title={facility.name}
              extra={
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => showModal(facility)}
                />
              }
              style={{ borderColor: '#fadb14' }}
              headStyle={{ backgroundColor: '#fadb14', color: '#004080' }}
            >
              <p>
                <strong>Address:</strong> {facility.address}
              </p>
              <p>
                <strong>GPS Coordinates:</strong> {facility.gpsLat},{' '}
                {facility.gpsLng}
              </p>
              <p>
                <strong>Type:</strong> {facility.type}
              </p>
              <p>
                <strong>Size:</strong> {facility.sizeSqm} sqm, {facility.floors}{' '}
                floors
              </p>
              <p>
                <strong>Contact:</strong> {facility.contactName} (
                {facility.contactPhone}, {facility.contactEmail})
              </p>
              {facility.mlDataJson && (
                <details style={{ marginTop: 8 }}>
                  <summary style={{ cursor: 'pointer', color: '#004080' }}>
                    View ML Data JSON
                  </summary>
                  <pre
                    style={{
                      whiteSpace: 'pre-wrap',
                      maxHeight: 150,
                      overflowY: 'auto',
                      backgroundColor: '#f0f0f0',
                      padding: '8px',
                      borderRadius: 4,
                      marginTop: 4,
                    }}
                  >
                    {JSON.stringify(facility.mlDataJson, null, 2)}
                  </pre>
                </details>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={editingFacility ? 'Edit Facility' : 'Add New Facility'}
        visible={isModalVisible}
        onCancel={handleCancel}
        okText={editingFacility ? 'Save' : 'Add'}
        onOk={() => form.submit()}
        okButtonProps={{
          style: {
            backgroundColor: '#fadb14',
            borderColor: '#fadb14',
            color: '#004080',
          },
        }}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddOrEditFacility}
          initialValues={{ type: 'Office' }}
        >
          <Form.Item
            label="Facility Name"
            name="name"
            rules={[{ required: true, message: 'Please input the facility name!' }]}
          >
            <Input placeholder="Enter facility name" />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please input the address!' }]}
          >
            <Input placeholder="Enter address" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="GPS Latitude"
                name="gpsLat"
                rules={[{ required: true, message: 'Please input GPS latitude!' }]}
              >
                <Input placeholder="Latitude" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="GPS Longitude"
                name="gpsLng"
                rules={[{ required: true, message: 'Please input GPS longitude!' }]}
              >
                <Input placeholder="Longitude" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Facility Type"
            name="type"
            rules={[{ required: true, message: 'Please select facility type!' }]}
          >
            <Select>
              {facilityTypes.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Size (sqm)"
                name="sizeSqm"
                rules={[{ required: true, message: 'Please input size in sqm!' }]}
              >
                <Input type="number" min={0} placeholder="Square meters" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Floors"
                name="floors"
                rules={[{ required: true, message: 'Please input number of floors!' }]}
              >
                <Input type="number" min={1} placeholder="Floors" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Contact Person Name"
            name="contactName"
            rules={[{ required: true, message: 'Please input contact person name!' }]}
          >
            <Input placeholder="Contact person name" />
          </Form.Item>

          <Form.Item
            label="Contact Phone"
            name="contactPhone"
            rules={[{ required: true, message: 'Please input contact phone!' }]}
          >
            <Input placeholder="Phone number" />
          </Form.Item>

          <Form.Item
            label="Contact Email"
            name="contactEmail"
            rules={[
              { required: true, message: 'Please input contact email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input placeholder="Email address" />
          </Form.Item>

          <Form.Item label="Upload ML Data JSON (optional)">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Upload JSON</Button>
            </Upload>
          </Form.Item>

          {mlData && (
            <Card
              size="small"
              type="inner"
              title="Loaded ML Data JSON"
              style={{ maxHeight: 200, overflowY: 'auto', marginTop: 12 }}
            >
              <pre style={{ whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(mlData, null, 2)}
              </pre>
            </Card>
          )}
        </Form>
      </Modal>
    </>
  );

  const placeholderContent = (key) => (
    <div style={{ textAlign: 'center', color: '#888', fontSize: 18, padding: 40 }}>
      {key.charAt(0).toUpperCase() + key.slice(1)} content is not implemented yet.
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#e6f7ff' }}>
      <Header style={{ padding: 0, backgroundColor: '#004080' }}>
        <Navbar />
      </Header>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={220}
          style={{ backgroundColor: '#001529' }}
        >
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="facilities" icon={<HomeOutlined />}>
              Facilities
            </Menu.Item>
            <Menu.Item key="users" icon={<UserOutlined />}>
              Users
            </Menu.Item>
            <Menu.Item key="analytics" icon={<BarChartOutlined />}>
              Analytics
            </Menu.Item>
            <Menu.Item key="settings" icon={<SettingOutlined />}>
              Settings
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '24px', backgroundColor: '#e6f7ff' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              backgroundColor: '#ffffff',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <Title level={2} style={{ color: '#004080', marginBottom: 24 }}>
              {selectedKey === 'facilities'
                ? 'Your Facilities'
                : selectedKey.charAt(0).toUpperCase() + selectedKey.slice(1)}
            </Title>
            {selectedKey === 'facilities' ? facilitiesContent : placeholderContent(selectedKey)}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
