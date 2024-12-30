import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { Avatar, Card, List, message, Space } from 'antd';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { listPostVoByPageUsingPost } from '@/services/backend/postController';

const DEFAULT_PAGE_PARAMS: PageRequest = {
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
};

/**
 * 主页
 * @constructor
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
      message.error('获取数据失败' + e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);

  const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  return (
    <PageContainer>
      <Card loading={loading}>
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 3,
          }}
          dataSource={dataList}
          footer={
            <div>
              <b>ant design</b> footer part
            </div>
          }
          renderItem={(item) => (
            <List.Item
              key={item.title}
              actions={[
                <IconText
                  icon={LikeOutlined}
                  text={String(item.favourNum)}
                  key="list-vertical-like-o"
                />,
                <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                <IconText
                  icon={StarOutlined}
                  text={String(item.thumbNum)}
                  key="list-vertical-star-o"
                />,
              ]}
              extra={
                <img
                  width={272}
                  alt="logo"
                  src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                />
              }
            >
              <List.Item.Meta
                avatar={<Avatar src={item.user?.userAvatar} />}
                title={<a href={item.href}>{item.title}</a>}
                // description={item.}
              />
              {item.content}
            </List.Item>
          )}
        />
      </Card>
    </PageContainer>
  );
};

export default PostPage;
