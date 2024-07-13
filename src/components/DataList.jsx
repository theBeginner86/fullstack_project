import React, { useState, useEffect } from 'react';
import { Table, Button, Checkbox } from 'antd';
import { fetchStudentColumns } from '../api';

const DataList = ({ data, onEdit, onSelect }) => {
  const [columns, setColumns] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const cols = await fetchStudentColumns();
        setColumns(cols);
      } catch (error) {
        console.error('Failed to fetch columns:', error);
      }
    };

    fetchColumns();
  }, []);

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
    onSelect(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const tableColumns = [
    ...columns.map(column => ({
      title: column,
      dataIndex: column,
      key: column,
    })),
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button onClick={() => onEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Table
      dataSource={data}
      columns={tableColumns}
      rowKey="ID"
      rowSelection={rowSelection}
    />
  );
};

export default DataList;
