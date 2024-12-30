import { editPostUsingPost } from '@/services/backend/postController';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import {message, Modal, Select, Tag} from 'antd';
import React from 'react';

interface Props {
  oldData?: API.PostVO;
  visible: boolean;
  onSubmit: (values: API.PostEditRequest) => void;
  onCancel: () => void;
}

const handleUpdate = async (fields: API.PostEditRequest) => {
  const hide = message.loading('正在更新');
  try {
    await editPostUsingPost(fields);
    hide();
    message.success('更新成功');
    return true;
  } catch (error: any) {
    hide();
    message.error('更新失败，' + error.message);
    return false;
  }
};

const UpdateModal: React.FC<Props> = (props) => {
  const { oldData, visible, onSubmit, onCancel } = props;
  console.log(oldData)
  const columns: ProColumns<API.PostVO>[] = [
    {
      title: '标题',
      dataIndex: 'title',
      width: '100%',
      formItemProps: {
        rules: [{ required: true, message: '请输入标题' }],
      },
    },
    {
      title: '内容',
      dataIndex: 'content',
      valueType: 'textarea',
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
      },
      renderFormItem(schema){
        const { fieldProps } = schema;
        return <Select {...fieldProps} mode="tags" />;
      },
      render(_, record) {
        if (!record.tags) {
          return <></>;
        }
        return JSON.parse(record.tags).map((tag: string) => {
          return <Tag key={tag}>{tag}</Tag>;
        });
      },
    },
  ];

  return (
    <Modal
      destroyOnClose
      title="编辑文章"
      open={visible}
      footer={null}
      onCancel={onCancel}
    >
      <ProTable
        type="form"
        columns={columns}
        form={{
          initialValues: oldData,
        }}
        onSubmit={async (values: API.PostEditRequest) => {
          const success = await handleUpdate({
            ...values,
            id: oldData?.id,
          });
          if (success) {
            onSubmit?.(values);
          }
        }}
      />
    </Modal>
  );
};

export default UpdateModal;
