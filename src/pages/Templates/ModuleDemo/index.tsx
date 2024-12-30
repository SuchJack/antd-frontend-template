import { PageContainer } from '@ant-design/pro-components';
import React from 'react';
import { Card, Row } from 'antd';
import FileUploader from '@/components/FileUploader';
import PictureUploader from '@/components/PictureUploader';

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
          <PictureUploader biz="generator_picture"/>
        </Card>
      </Row>
    </PageContainer>
  );
};

export default ModuleDemo;
