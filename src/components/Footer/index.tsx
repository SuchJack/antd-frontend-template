import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';

const Footer: React.FC = () => {
  const defaultMessage = 'SuchJack';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'codeNav',
          title: 'SuchJack',
          href: 'https://such-jack.top',
          blankTarget: true,
        },
        {
          key: 'Ant Design',
          title: 'SuchJack',
          href: 'https://such-jack.top',
          blankTarget: true,
        },
        {
          key: 'github',
          title: (
            <>
              <GithubOutlined /> SuchJack
            </>
          ),
          href: 'https://github.com/SuchJack',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
