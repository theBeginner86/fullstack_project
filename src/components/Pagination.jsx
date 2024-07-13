import React from 'react';
import { Pagination as AntPagination, Select } from 'antd';

const Pagination = ({ totalRecords, currentPage, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="flex items-center justify-between mt-4">
      <span>Total records: {totalRecords}</span>
      <AntPagination
        current={currentPage}
        pageSize={pageSize}
        total={totalRecords}
        onChange={(page, pageSize) => onPageChange(page, pageSize)}
      />
      <Select value={pageSize} onChange={(value) => onPageChange(1, value)}>
        <Select.Option value={5}>5</Select.Option>
        <Select.Option value={10}>10</Select.Option>
        <Select.Option value={20}>20</Select.Option>
      </Select>
    </div>
  );
};

export default Pagination;
