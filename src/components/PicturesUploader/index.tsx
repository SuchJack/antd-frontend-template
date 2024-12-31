import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { GetProp, Image, message, Upload, UploadFile, UploadProps } from 'antd';
import { uploadFileUsingPost } from '@/services/backend/fileController';
import {COS_HOST} from "@/constants";

interface Props {
  biz: string;
  onChange?: (value: string) => void;
  value?: string[];
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const PicturesUploader: React.FC<Props> = (props) => {
  const { biz, onChange, value } = props;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  // @ts-ignore
  const [fileList, setFileList] = useState<UploadFile[]>(value);
  const [loading, setLoading] = useState(false);

  const handlePreview = async (file: UploadFile) => {
    console.log('handlePreview函数调用了...')
    console.dir(file)
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // 转换文件列表，确保 url 字段正确
    const processedFileList = newFileList.map(file => {
      if (file.status === 'done' && file.response) {
        // 如果上传完成，使用响应中的 URL
        return {
          ...file,
          url: file.response // response 就是完整的图片 URL
        };
      }
      return file;
    });

    setFileList(processedFileList);
    // 通知父组件
    const urls = processedFileList
      .filter(file => file.status === 'done')
      .map(file => file.url);
    // @ts-ignore
    onChange?.(urls);
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const uploadProps: UploadProps = {
    listType: 'picture-card',
    fileList: fileList,
    onPreview: handlePreview,
    onChange: handleChange,
    customRequest: async (fileObj: any) => {
      setLoading(true);
      try {
        const res = await uploadFileUsingPost(
          {
            biz,
          },
          {},
          fileObj.file,
        );
        console.log(res)
        const fullPath = COS_HOST + res.data;
        fileObj.onSuccess(fullPath);
      }catch (e:any){
        message.error('上传失败,' + e.message)
        fileObj.onError(e)
      }
      setLoading(false);
    },
  };
  return (
    <>
      <Upload {...uploadProps}>{fileList.length >= 8 ? null : uploadButton}</Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default PicturesUploader;
