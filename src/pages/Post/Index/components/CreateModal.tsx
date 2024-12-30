import { addPostUsingPost } from '@/services/backend/postController';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import React from 'react';

interface Props {
  visible: boolean;
  onSubmit: (values: API.PostAddRequest) => void;
  onCancel: () => void;
}

const handleAdd = async (fields: API.PostAddRequest) => {
  const hide = message.loading('正在发布');
  try {
    await addPostUsingPost(fields);
    hide();
    message.success('发布成功');
    return true;
  } catch (error: any) {
    hide();
    message.error('发布失败，' + error.message);
    return false;
  }
};

const CreateModal: React.FC<Props> = (props) => {
  const { visible, onSubmit, onCancel } = props;

  const columns: ProColumns<API.PostVO>[] = [
    {
      title: '标题',
      dataIndex: 'title',
      width: '100%',
      fieldProps: {
        placeholder: '请输入文章标题',
      },
      formItemProps: {
        rules: [{ required: true, message: '请输入标题' }],
      },
    },
    {
      title: '内容',
      dataIndex: 'content',
      valueType: 'textarea',
      fieldProps: {
        placeholder: '请输入文章内容',
      },
      formItemProps: {
        rules: [{ required: true, message: '请输入内容' }],
      },
    },
    {
      title: '标签',
      dataIndex: 'tags',
      valueType: 'select',
      fieldProps: {
        mode: 'tags',
        placeholder: '请选择标签',
      },
    },
  ];

  return (
    <Modal
      destroyOnClose
      title="发布文章"
      open={visible}
      footer={null}
      onCancel={onCancel}
    >
      <ProTable
        type="form"
        columns={columns}
        onSubmit={async (values: API.PostAddRequest) => {
          const success = await handleAdd(values);
          if (success) {
            onSubmit?.(values);
          }
        }}
      />
    </Modal>
  );
};

export default CreateModal; 