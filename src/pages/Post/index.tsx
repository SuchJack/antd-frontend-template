import {ActionType, PageContainer} from '@ant-design/pro-components';
import React, {useEffect, useRef, useState} from 'react';
import { Avatar, Card, List, message, Space, Tag, Typography } from 'antd';
import { LikeOutlined, MessageOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import { listPostVoByPageUsingPost } from '@/services/backend/postController';
import moment from 'moment';
import {doThumbUsingPost} from "@/services/backend/postThumbController";
import {doPostFavourUsingPost} from "@/services/backend/postFavourController";

const { Text, Paragraph } = Typography;

const DEFAULT_PAGE_PARAMS: PageRequest = {
  current: 1,
  pageSize: 5,
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
  const actionRef = useRef<ActionType>();
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


  const handleThumb =  async (postId: number) => {
    if (postId) {
      try {
        const res = await doThumbUsingPost({postId})
        message.success(res.data === 1 ? '点赞成功' : '取消点赞成功');
      } catch (e: any) {
        message.error('点赞失败,' + e.message);
      }
    }
  };
  // 处理收藏
  const handleFavour = async (postId: number) => {
    if (postId) {
      try {
        const res = await doPostFavourUsingPost({postId})
        message.success(res.data === 1 ? '收藏成功' : '取消收藏成功');
      } catch (e: any) {
        message.error('点赞失败,' + e.message);
      }
    }
  };

  const IconText = ({ icon, text, onClick, highlighted }: {
    icon: React.FC;
    text: string;
    onClick?: () => void;
    highlighted?: boolean;
  }) => (
    <Space
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        color: highlighted ? '#1890ff' : 'inherit',
      }}
    >
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
            pageSizeOptions: ['5', '10', '15', '20'],
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `总共 ${total} 条`,
          }}
          dataSource={dataList}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                <IconText key={item.id} icon={LikeOutlined} text={String(item.thumbNum ?? 0)}  onClick={() => handleThumb((item.id) as number)} highlighted={item.hasThumb}/>,
                <IconText key={item.id} icon={MessageOutlined} text={String(item.thumbNum ?? 0)} />,
                <IconText key={item.id} icon={StarOutlined} text={String(item.favourNum ?? 0)} onClick={() => handleFavour((item.id) as number)} highlighted={item.hasFavour}/>,
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
