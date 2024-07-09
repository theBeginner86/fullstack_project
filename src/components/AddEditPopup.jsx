import React, { useState, useEffect } from 'react';
import { Modal, Input, Button } from 'antd';

const AddEditPopup = ({ isOpen, data, onSave, onClose }) => {
  const [formData, setFormData] = useState(data || {});

  useEffect(() => {
    setFormData(data || {});
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Modal
      title={data ? 'Edit Record' : 'Add Record'}
      visible={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>Close</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>Save</Button>
      ]}
    >
      <Input
        name="column1"
        value={formData.column1 || ''}
        onChange={handleChange}
        placeholder="Column #1"
        className="mb-2"
      />
      <Input
        name="column2"
        value={formData.column2 || ''}
        onChange={handleChange}
        placeholder="Column #2"
        className="mb-2"
      />
    </Modal>
  );
};

export default AddEditPopup;
