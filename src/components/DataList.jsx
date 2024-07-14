import React, { useState, useEffect } from 'react';
import { Table, Button, Space } from 'antd';
import { fetchEntityColumns } from '../api';

const DataList = ({ data, onEdit, onDelete, entity }) => {
  const [columns, setColumns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Default page size
  const [totalRecords, setTotalRecords] = useState(0);

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
      title: <div className="text-center">Actions</div>,
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => onEdit(record)}>Edit</Button>
          <Button onClick={() => onDelete(record[rowKey])} danger>Delete</Button>
        </Space>
      ),
    },
  ];

  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  return (
    <>
      <Table
        dataSource={data}
        columns={tableColumns}
        rowKey={rowKey}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalRecords,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          onChange: handlePaginationChange,
          showSizeChanger: true,
          pageSizeOptions: ['5', '20', '50', '100'], // Customize page size options if needed
        }}
        onChange={(pagination, filters, sorter) => {
          console.log('params', pagination, filters, sorter);
        }}
      />
    </>
  );
};

export default DataList;
