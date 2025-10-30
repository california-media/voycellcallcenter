import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Input, 
  Typography, 
  Space, 
  message, 
  Spin,
  Alert,
  Row,
  Col,
  Divider
} from 'antd';
import { CopyOutlined, EyeInvisibleOutlined, EyeTwoTone, LinkOutlined } from '@ant-design/icons';
import api from '../../../core/axios/axiosInstance';


const { Title, Text, Paragraph } = Typography;

const Api = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [visible, setVisible] = useState(false);

  // Fetch current API key on component mount
  useEffect(() => {
    fetchCurrentApiKey();
  }, []);

  const fetchCurrentApiKey = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api-key/current');
      if (response.data.status === 'success') {
        setApiKey(response.data.data.apiKey);
      }
    } catch (error) {
      console.error('Error fetching API key:', error);
      // Don't show error message on initial load if no key exists
      if (error.response?.status !== 404) {
        message.error('Failed to fetch API key');
      }
    } finally {
      setLoading(false);
    }
  };

  const generateNewApiKey = async () => {
    try {
      setGenerating(true);
      const response = await api.post('/api-key/generate');
      if (response.data.status === 'success') {
        setApiKey(response.data.data.apiKey);
        message.success('API key generated successfully');
      }
    } catch (error) {
      console.error('Error generating API key:', error);
      message.error('Failed to generate API key');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
      message.success('API key copied to clipboard');
    } catch (error) {
      console.error('Failed to copy:', error);
      message.error('Failed to copy API key');
    }
  };

  const openApiDocumentation = () => {
    window.open('https://contactsmanagement.readme.io/', '_blank');
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <Title level={2} style={{ marginBottom: '8px', color: '#1890ff' }}>
              Voycell API
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#666', marginBottom: '24px' }}>
              You can use the Voycell API to integrate Voycell with your own workflows and applications. 
              You're able to create, update, and delete contacts, notes, and reminders. Do not share your API key.
            </Paragraph>
          </div>

          {/* API Key Section */}
          <Card 
            title="Your API Key" 
            style={{ marginBottom: '24px' }}
            extra={
              <Button 
                type="primary" 
                onClick={generateNewApiKey} 
                loading={generating}
              >
                Generate API Key
              </Button>
            }
          >
            <Paragraph style={{ marginBottom: '16px', color: '#666' }}>
              Include the following unique Contacts Management API key as a value for <code>api-key</code> header 
              for requests you make to the Contacts Management API.
            </Paragraph>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin size="large" />
              </div>
            ) : (
              <>
                {apiKey ? (
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Input.Password
                      value={apiKey}
                      readOnly
                      visibilityToggle={{
                        visible: visible,
                        onVisibleChange: setVisible,
                      }}
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      style={{ 
                        fontFamily: 'monospace', 
                        fontSize: '14px',
                        backgroundColor: '#f5f5f5'
                      }}
                      suffix={
                        <Button 
                          type="text" 
                          icon={<CopyOutlined />} 
                          onClick={copyToClipboard}
                          size="small"
                        />
                      }
                    />
                    <Alert
                      message="Keep your API key secure"
                      description="Your API key carries many privileges, so be sure to keep it secure! Do not share your secret API key in publicly accessible areas such as GitHub, client-side code, and so forth."
                      type="warning"
                      showIcon
                      style={{ marginTop: '16px' }}
                    />
                  </Space>
                ) : (
                  <Alert
                    message="No API key generated"
                    description="Click the 'Generate API Key' button above to create your API key."
                    type="info"
                    showIcon
                  />
                )}
              </>
            )}
          </Card>

          {/* Documentation Section */}
          <Card title="API Documentation">
            <Row gutter={[24, 24]}>
              <Col xs={48} sm={16}>
                <div>
                  <Title level={4} style={{ marginBottom: '8px' }}>
                    Getting Started
                  </Title>
                  <Paragraph style={{ marginBottom: '16px' }}>
                    Learn how to authenticate requests, handle responses, and explore all available endpoints 
                    in our comprehensive API documentation.
                  </Paragraph>
                  <Text type="secondary">
                    Explore endpoints for contacts, notes, reminders, and more.
                  </Text>
                </div>
              </Col>
              <Col xs={28} sm={10} style={{ textAlign: 'center' }}>
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<LinkOutlined />}
                  onClick={openApiDocumentation}
                  style={{ width: '100%' }}
                >
                  Open API Documentation
                </Button>
              </Col>
            </Row>
          </Card>

          
        </div>
      </div>
    </div>
  );
};

export default Api;