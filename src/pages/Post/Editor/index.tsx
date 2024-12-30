import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { useParams } from '@@/exports';
import { Button, Card, Form, Input, message, Space } from 'antd';
import { getPostVoByIdUsingGet, editPostUsingPost } from '@/services/backend/postController';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { history } from '@umijs/max';

const PostEditor: React.FC = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // 工具栏配置
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

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
      form.setFieldsValue(res.data);
    } catch (e: any) {
      message.error('获取文章失败，' + e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const onFinish = async (values: any) => {
    if (!id) {
      return;
    }
    setSubmitting(true);
    try {
      await editPostUsingPost({
        id,
        ...values,
      });
      message.success('更新成功');
      history.push('/post');
    } catch (e: any) {
      message.error('更新失败，' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <PageContainer title="编辑文章">
      <Card loading={loading}>
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入标题" />
          </Form.Item>

          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <ReactQuill
              modules={modules}
              theme="snow"
              style={{ height: '400px', marginBottom: '50px' }}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
              <Button onClick={() => window.history.back()}>
                返回
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default PostEditor;
