import React from 'react';
import { Table, Button } from 'antd';

const DataList = ({ data, onEdit }) => {
  const columns = [
    {
      title: 'Select',
      dataIndex: 'select',
      render: () => <input type="checkbox" />
    },
    {
      title: 'Column #1',
      dataIndex: 'column1',
    },
    {
      title: 'Column #2',
      dataIndex: 'column2',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_, record) => <Button onClick={() => onEdit(record)}>Edit</Button>
    },
  ];

  return (
    <Table columns={columns} dataSource={data} rowKey="id" />
  );
};

export default DataList;
