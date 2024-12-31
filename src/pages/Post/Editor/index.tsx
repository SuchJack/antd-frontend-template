import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import { useParams } from '@@/exports';
import { Button, Card, Form, Input, message, Space } from 'antd';
import { editPostUsingPost, getPostVoByIdUsingGet } from '@/services/backend/postController';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { history } from '@umijs/max';
import { COS_HOST } from '@/constants';
import { uploadFileUsingPost } from '@/services/backend/fileController';

const PostEditor: React.FC = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

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
      const res: any = await editPostUsingPost({
        id,
        ...values,
      });
      if (res?.data?.code === 0) {
        message.success('更新成功');
      }
      history.push('/post');
    } catch (e: any) {
      message.error('更新失败，' + e.message);
    }
    setSubmitting(false);
  };

  // 图片处理函数
  const handleImage = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          const res = await uploadFileUsingPost(
            {
              biz: 'post_image',
            },
            {},
            file,
          );
          // 获取富文本实例
          const quill = (document.querySelector('.ql-editor') as any)?.env?.quill;
          // 获取当前光标位置
          const range = quill?.getSelection(true);
          // 插入图片
          quill?.insertEmbed(range?.index ?? 0, 'image', COS_HOST + res.data);
        } catch (e: any) {
          message.error('上传失败，' + e.message);
        }
      }
    };
  };

  // 配置工具栏和图片处理
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ['link', 'image'],
        ['clean'],
      ],
      handlers: {
        image: handleImage,
      },
    },
    clipboard: {
      matchVisual: false,
      matchers: [
        [
          'img',
          (node: any, delta: any) => {
            const image = node.getAttribute('src');
            if (image && image.startsWith('data:')) {
              // 如果是 base64 图片，则上传
              // eslint-disable-next-line @typescript-eslint/no-use-before-define
              const blob = dataURLtoBlob(image);
              uploadFileUsingPost(
                { biz: 'post_picture' },
                {},
                new File([blob], 'paste.png', { type: 'image/png' }),
              ).then((res) => {
                const quill = (document.querySelector('.ql-editor') as any)?.env?.quill;
                if (quill) {
                  const range = quill.getSelection(true);
                  quill.insertEmbed(range.index, 'image', COS_HOST + res.data);
                }
              });
            }
            return delta;
          },
        ],
      ],
    },
  };
  // base64 转 blob
  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  return (
    <PageContainer title="编辑文章">
      <Card loading={loading}>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
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
              <Button onClick={() => window.history.back()}>返回</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default PostEditor;
