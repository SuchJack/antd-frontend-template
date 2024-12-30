import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { Avatar, Card, List, message, Space, Tag, Typography } from 'antd';
import { LikeOutlined, MessageOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import { listPostVoByPageUsingPost } from '@/services/backend/postController';
import moment from 'moment';

const { Text, Paragraph } = Typography;

const DEFAULT_PAGE_PARAMS: PageRequest = {
  current: 1,
  pageSize: 8,
  sortField: 'createTime',
  sortOrder: 'descend',
};

/**
 * 帖子主页
 */
const PostPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [dataList, setDataList] = useState<API.PostVO[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searchParams, setSearchParams] = useState<API.PostQueryRequest>({
    ...DEFAULT_PAGE_PARAMS,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listPostVoByPageUsingPost(searchParams);
      setDataList(res.data?.records ?? []);
      setTotal(res.data?.total ?? 0);
    } catch (e: any) {
      message.error('获取数据失败,' + e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);

  const IconText = ({ icon, text, onClick }: { icon: React.FC; text: string; onClick?: () => void }) => (
    <Space onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  return (
    <PageContainer>
      <Card loading={loading}>
        <List<API.PostVO>
          itemLayout="vertical"
          size="large"
          pagination={{
            current:searchParams.current,
            pageSize: searchParams.pageSize,
            onChange: (current:number, pageSize:number) => {
              setSearchParams({
                ...searchParams,
                current,
                pageSize,
              });
            },
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `总共 ${total} 条`,
          }}
          dataSource={dataList}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                <IconText key={item.id} icon={LikeOutlined} text={String(item.favourNum ?? 0)} />,
                <IconText key={item.id} icon={MessageOutlined} text={String(item.thumbNum ?? 0)} />,
                <IconText key={item.id} icon={StarOutlined} text={String(item.thumbNum ?? 0)} />,
              ]}
              extra={
                item.tagList && (
                  <Space wrap>
                    {item.tagList?.map((tag) => (
                      <Tag key={tag} color="blue">
                        {tag}
                      </Tag>
                    ))}
                  </Space>
                )
              }
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={item.user?.userAvatar}
                    icon={!item.user?.userAvatar && <UserOutlined />}
                  />
                }
                title={
                  <Space>
                    <a className="post-title" href={`/post/${item.id}`}>
                      {item.title}
                    </a>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {moment(item.createTime).format('YYYY-MM-DD HH:mm')}
                    </Text>
                  </Space>
                }
                description={
                  <Space>
                    <Text type="secondary">{item.user?.userName ?? '匿名用户'}</Text>
                  </Space>
                }
              />
              <Paragraph
                ellipsis={{ rows: 2, expandable: true, symbol: '展开' }}
                style={{ marginBottom: 8 }}
              >
                {item.content}
              </Paragraph>
            </List.Item>
          )}
        />
      </Card>
    </PageContainer>
  );
};

export default PostPage;
