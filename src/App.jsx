import React, { useState, useEffect } from 'react';
import SearchCriteria from './components/SearchCriteria';
import SortFilter from './components/SortFilter';
import DataList from './components/DataList';
import Pagination from './components/Pagination';
import AddEditPopup from './components/AddEditPopup';
import {
  fetchStudentColumns,
  searchStudents,
  sortStudents,
  selectAllStudents,
  insertStudent,
  deleteStudents,
  fetchStudentById,
  updateStudent
} from './api';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Name');
  const [sortType, setSortType] = useState('ascending');
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [popupOpen, setPopupOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allStudents = await selectAllStudents();
        setData(allStudents);
        setTotalRecords(allStudents.length);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (value) => {
    setSearchTerm(value); 
  };
  
  

  const handleSearch = async (column, searchTerm) => {
    try {
      const searchedStudents = await searchStudents(column, searchTerm);
      setData(searchedStudents);
      setTotalRecords(searchedStudents.length);
    } catch (error) {
      console.error('Failed to search students:', error);
    }
  };

  const handleReset = async () => {
    setSearchTerm('');
    try {
      const allStudents = await selectAllStudents();
      setData(allStudents);
      setTotalRecords(allStudents.length);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleSortTypeChange = (value) => {
    setSortType(value);
  };

  const handleSort = async () => {
    try {
      const sortedStudents = await sortStudents(sortBy, sortType);
      setData(sortedStudents);
    } catch (error) {
      console.error('Failed to sort students:', error);
    }
  };

  const handleAdd = () => {
    console.log('Opening add popup');
    setEditData(null); 
    setPopupOpen(true);
    setEditData(null); 
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert('No records selected');
      return;
    }
    const confirmed = window.confirm(`Are you sure you want to delete IDs: ${selectedIds.join(', ')}?`);
    if (confirmed) {
      try {
        await deleteStudents(selectedIds);
        const allStudents = await selectAllStudents();
        setData(allStudents);
        setTotalRecords(allStudents.length);
        setSelectedIds([]); 
      } catch (error) {
        console.error('Failed to delete students:', error);
      }
    }
  };

  const handleEdit = (item) => {
    setEditData(item);
    setPopupOpen(true);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleSave = async (formData) => {
    try {
      if (editData) {
        await updateStudent(editData.ID, formData);
      } else {
        await insertStudent(formData);
      }
      const allStudents = await selectAllStudents();
      setData(allStudents);
      setTotalRecords(allStudents.length);
      setPopupOpen(false);
      setEditData(null);
    } catch (error) {
      console.error('Failed to save student:', error);
    }
  };

  const handleClose = () => setPopupOpen(false);

  return (
    <div className="container mx-auto p-4">
      <SearchCriteria 
        onSearch={handleSearch}
        onReset={handleReset}
      />
      <SortFilter
        sortBy={sortBy}
        sortType={sortType}
        onSortChange={handleSortChange}
        onSortTypeChange={handleSortTypeChange}
        onSort={handleSort}
        onAdd={handleAdd}
        onDelete={handleDelete}
      />
      <DataList data={data} onEdit={handleEdit} onSelect={setSelectedIds} />
      <Pagination
        totalRecords={totalRecords}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
      <AddEditPopup
        isOpen={popupOpen}
        data={editData}
        onSave={handleSave}
        onClose={handleClose}
      />
    </div>
  );
};

export default App;
