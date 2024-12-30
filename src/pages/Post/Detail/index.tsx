import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { useParams } from "@@/exports";
import { getPostVoByIdUsingGet } from '@/services/backend/postController';
import {Avatar, Button, Card, message, Space, Tag, Typography} from 'antd';
import {EditOutlined, UserOutlined} from '@ant-design/icons';
import moment from 'moment';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import { history } from '@umijs/max'

const { Title, Text } = Typography;

const PostDetailPage: React.FC = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<API.PostVO>();

  const loadData = async () => {
    if (!id) {
      return;
    }
    setLoading(true);
    try {
      const res = await getPostVoByIdUsingGet({
      // @ts-ignore
        id,
      });
      setData(res.data);
    } catch (e: any) {
      message.error('获取数据失败,' + e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  return (
    <PageContainer title={<></>}>
      <Card loading={loading}>
        {data ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
                {data.title}
              </Title>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => history.push(`/post/editor/${id}`)}
                style={{ marginTop: 24 }}
              >
                编辑
              </Button>
            </div>
            <Space align="center" style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <Avatar src={data.user?.userAvatar} icon={!data.user?.userAvatar && <UserOutlined />} />
              <Text type="secondary">{data.user?.userName ?? '匿名用户'}</Text>
              <Text type="secondary">{moment(data.createTime).format('YYYY-MM-DD HH:mm')}</Text>
              {data.tags && (
                <Space>
                  {data.tags.map((tag) => (
                    <Tag key={tag} color="blue">
                      {tag}
                    </Tag>
                  ))}
                </Space>
              )}
            </Space>
            <ReactQuill
              value={data.content}
              readOnly={true}
              theme="bubble"
              style={{
                border: 'none',
                padding: '0 24px',
              }}
            />
          </>
        ) : null}
      </Card>
    </PageContainer>
  );
};

export default PostDetailPage;
