import { PageContainer, ProFormSelect, ProFormText, QueryFilter } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, Flex, List, message, Space, Tabs, Tag, Typography } from 'antd';
import { LikeOutlined, MessageOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import { listPostVoByPageUsingPost } from '@/services/backend/postController';
import moment from 'moment';
import { doThumbUsingPost } from '@/services/backend/postThumbController';
import { doPostFavourUsingPost } from '@/services/backend/postFavourController';
import CreateModal from '@/pages/Post/Index/components/CreateModal';
import UpdateModal from '@/pages/Post/Index/components/UpdateModal';
import { Input } from 'antd/lib';
import { Link } from '@@/exports';
import ReactQuill from 'react-quill';

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
  const [searchParams, setSearchParams] = useState<API.PostQueryRequest>({
    ...DEFAULT_PAGE_PARAMS,
  });

  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.PostVO>();

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

  // 处理点赞
  const handleThumb = async (postId: number) => {
    if (postId) {
      try {
        const res = await doThumbUsingPost({ postId });
        // 更新本地数据状态
        setDataList(
          dataList.map((item) => {
            if (item.id === postId) {
              return {
                ...item,
                hasThumb: !item.hasThumb,
                thumbNum: item.hasThumb ? (item.thumbNum ?? 0) - 1 : (item.thumbNum ?? 0) + 1,
              };
            }
            return item;
          }),
        );
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
        const res = await doPostFavourUsingPost({ postId });
        // 更新本地数据状态
        setDataList(
          dataList.map((item) => {
            if (item.id === postId) {
              return {
                ...item,
                hasFavour: !item.hasFavour,
                favourNum: item.hasFavour ? (item.favourNum ?? 0) - 1 : (item.favourNum ?? 0) + 1,
              };
            }
            return item;
          }),
        );
        message.success(res.data === 1 ? '收藏成功' : '取消收藏成功');
      } catch (e: any) {
        message.error('收藏失败,' + e.message);
      }
    }
  };

  const IconText = ({
    icon,
    text,
    onClick,
    highlighted,
  }: {
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
    <PageContainer title={<></>}>
      <Flex justify="center">
        <Input.Search
          style={{
            width: '40vw',
            minWidth: 320,
          }}
          placeholder="搜索文章"
          allowClear
          enterButton="搜索"
          size="large"
          onChange={(e) => {
            searchParams.searchText = e.target.value;
          }}
          onSearch={(value: string) => {
            setSearchParams({
              ...DEFAULT_PAGE_PARAMS,
              searchText: value,
            });
          }}
        />
      </Flex>
      <div style={{ marginBottom: 16 }} />
      <Card>
        <Button
          key="create"
          type="primary"
          onClick={() => {
            setCreateModalVisible(true);
          }}
        >
          发布
        </Button>
      </Card>
      <Tabs
        size="large"
        defaultActiveKey="newest"
        items={[
          {
            key: 'newest',
            label: `最新`,
          },
          {
            key: 'recommend',
            label: `推荐`,
          },
        ]}
      />

      <QueryFilter
        span={12}
        labelWidth="auto"
        labelAlign="left"
        defaultCollapsed={false}
        style={{ padding: '16px 0' }}
        onFinish={async (values: API.PostQueryRequest) => {
          setSearchParams({
            ...DEFAULT_PAGE_PARAMS,
            ...values,
            searchText: searchParams.searchText,
          });
        }}
      >
        <ProFormText label="名称" name="title" />
        <ProFormText label="文本" name="content" />
        {/*<ProFormText label="作者" name="user"/>*/}
        <ProFormSelect label="标签" name="tags" mode="tags" />
      </QueryFilter>

      <div style={{ marginBottom: 24 }} />

      <Card loading={loading}>
        <List<API.PostVO>
          itemLayout="vertical"
          size="large"
          pagination={{
            current: searchParams.current,
            pageSize: searchParams.pageSize,
            onChange: (current: number, pageSize: number) => {
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
                <IconText
                  key={item.id}
                  icon={LikeOutlined}
                  text={String(item.thumbNum ?? 0)}
                  onClick={() => handleThumb(item.id as number)}
                  highlighted={item.hasThumb}
                />,
                <IconText key={item.id} icon={MessageOutlined} text={'22'} />,
                <IconText
                  key={item.id}
                  icon={StarOutlined}
                  text={String(item.favourNum ?? 0)}
                  onClick={() => handleFavour(item.id as number)}
                  highlighted={item.hasFavour}
                />,
                <Button
                  key={item.id}
                  onClick={() => {
                    setUpdateModalVisible(true);
                    setCurrentRow(item);
                  }}
                >
                  编辑
                </Button>,
              ]}
              extra={
                item.tags && (
                  <Space wrap>
                    {item.tags?.map((tag) => (
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
                <Link
                  to={`/post/detail/${item.id}`}
                  style={{ fontFamily: 'inherit', fontSize: 'inherit', color: 'inherit' }}
                >
                  {/*{item.content}*/}
                    <ReactQuill
                      value={item.content}
                      readOnly={true}
                      theme="bubble"
                      style={{
                        border: 'none',
                        padding: 0,
                      }}
                    />
                </Link>
              </Paragraph>
            </List.Item>
          )}
        />
      </Card>
      <CreateModal
        visible={createModalVisible}
        onSubmit={() => {
          setCreateModalVisible(false);
          loadData();
        }}
        onCancel={() => {
          setCreateModalVisible(false);
        }}
      ></CreateModal>
      <UpdateModal
        visible={updateModalVisible}
        onSubmit={() => {
          setUpdateModalVisible(false);
          loadData();
        }}
        onCancel={() => {
          setUpdateModalVisible(false);
        }}
        oldData={currentRow}
      ></UpdateModal>
    </PageContainer>
  );
};

export default PostPage;
