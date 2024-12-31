import { PageContainer } from '@ant-design/pro-components';
import React from 'react';
import { Card, Row } from 'antd';
import FileUploader from '@/components/FileUploader';
import PictureUploader from '@/components/PictureUploader';
import PicturesUploader from "@/components/PicturesUploader";


const value = [
  {
    uid: '-1',
    name: 'image.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  }
]

const ModuleDemo: React.FC = () => {
  return (
    <PageContainer title={<></>}>
      <Row>
        <Card title={'文件上传组件'}>
          <FileUploader biz="generator_dist" description="description自定义" />
        </Card>
      </Row>
      <Row>
        <Card title={'图片上传组件'}>
          <PictureUploader biz="generator_picture" />
        </Card>
      </Row>
      <Row>
        <Card title={'图片组上传组件'}>
          <PicturesUploader biz="generator_picture" value={value as any}/>
        </Card>
      </Row>
    </PageContainer>
  );
};

export default ModuleDemo;
