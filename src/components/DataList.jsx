import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import { fetchEntityColumns } from '../api';

const DataList = ({ data, onEdit, onSelect, entity }) => {
  const [columns, setColumns] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const cols = await fetchEntityColumns(entity);
        setColumns(cols);
      } catch (error) {
        console.error('Failed to fetch columns:', error);
      }
    };

    fetchColumns();
  }, [entity]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    onSelect(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // Determine the row key based on entity
  let rowKey;
  if (entity === 'mentors') {
    rowKey = 'MentorID';
  } else if (entity === 'students') {
    rowKey = 'ID';
  } else if (entity === 'projects') {
    rowKey = 'ProjectID'; 
  }

  const tableColumns = [
    ...columns.map((column) => ({
      title: column,
      dataIndex: column,
      key: column,
    })),
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button onClick={() => onEdit(record)}>Edit</Button>
      ),
    },
  ];

  return (
    <Table
      dataSource={data}
      columns={tableColumns}
      rowKey={rowKey}
      rowSelection={rowSelection}
    />
  );
};

export default DataList;
