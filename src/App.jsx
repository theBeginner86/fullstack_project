import React, { useState, useEffect } from 'react';
import SearchCriteria from './components/SearchCriteria';
import SortFilter from './components/SortFilter';
import DataList from './components/DataList';
import Pagination from './components/Pagination';
import AddEditPopup from './components/AddEditPopup';
import {
  searchRecords,
  sortRecords,
  selectAllRecords,
  insertStudent,
  deleteStudents,
  updateStudent,
  insertMentor,
  updateMentor,
  deleteMentors,
  insertProject,
  updateProject,
  deleteProjects
} from './api';

const App = () => {
  const [entity, setEntity] = useState('projects');
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

///////////////////////////////// COMMON METHODS ////////////////////////////////////
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allRecords = await selectAllRecords(entity);
        setData(allRecords);
        setTotalRecords(allRecords.length);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    };

    fetchData();
  }, []);
  
  const handleSearch = async (entity, column, searchTerm) => {
    try {
      const searchedRecords = await searchRecords(entity, column, searchTerm);
      setData(searchedRecords);
      setTotalRecords(searchedRecords.length);
    } catch (error) {
      console.error('Failed to search ${entity}:', error);
    }
  };

  const handleReset = async () => {
    setSearchTerm('');
    try {
      const allRecords = await selectAllRecords(entity);
      setData(allRecords);
      setTotalRecords(allRecords.length);
    } catch (error) {
      console.error('Failed to fetch records:', error);
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
      const sortedRecords = await sortRecords(entity, sortBy, sortType);
      setData(sortedRecords);
    } catch (error) {
      console.error('Failed to sort records of ${entity}:', error);
    }
  };

  const handleAdd = () => {
    setEditData(null); 
    setPopupOpen(true);
    setEditData(null); 
  };

  const handleEdit = (item) => {
    setEditData(item);
    setPopupOpen(true);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleClose = () => setPopupOpen(false);

///////////////////////////////////////// STUDENT METHODS /////////////////////////////////////////////

  const handleDeleteStudent = async () => {
    if (selectedIds.length === 0) {
      alert('No records selected');
      return;
    }
    const confirmed = window.confirm(`Are you sure you want to delete IDs: ${selectedIds.join(', ')}?`);
    if (confirmed) {
      try {
        await deleteStudents(selectedIds);
        const allRecords = await selectAllRecords(entity);
        setData(allRecords);
        setTotalRecords(allRecords.length);
        setSelectedIds([]); 
      } catch (error) {
        console.error('Failed to delete records:', error);
      }
    }
  };

  const handleSaveStudent = async (formData) => {
    try {
      if (editData) {
        await updateStudent(editData.ID, formData);
      } else {
        await insertStudent(formData);
      }
      const allRecords = await selectAllRecords(entity);
      setData(allRecords);
      setTotalRecords(allRecords.length);
      setPopupOpen(false);
      setEditData(null);
    } catch (error) {
      console.error('Failed to save record:', error);
    }
  };

///////////////////////////////////////// MENTOR METHODS /////////////////////////////////////////////

  const handleSaveMentor = async (formData) => {
    try {
      if (editData) {
        await updateMentor(editData.MentorID, formData);
      } else {
        await insertMentor(formData);
      }
      const allRecords = await selectAllRecords(entity);
      setData(allRecords);
      setTotalRecords(allRecords.length);
      setPopupOpen(false);
      setEditData(null);
    } catch (error) {
      console.error('Failed to save record:', error);
    }
  };

  const handleDeleteMentor = async () => {
    if (selectedIds.length === 0) {
      alert('No records selected');
      return;
    }
    const confirmed = window.confirm(`Are you sure you want to delete IDs: ${selectedIds.join(', ')}?`);
    if (confirmed) {
      try {
        await deleteMentors(selectedIds);
        const allRecords = await selectAllRecords(entity);
        setData(allRecords);
        setTotalRecords(allRecords.length);
        setSelectedIds([]); 
      } catch (error) {
        console.error('Failed to delete records:', error);
      }
    }
  };

///////////////////////////////////////// PROJECT METHODS /////////////////////////////////////////////

const handleSaveProject = async (formData) => {
  try {
    if (editData) {
      await updateProject(editData.ProjectID, formData);
    } else {
      await insertProject(formData);
    }
    const allRecords = await selectAllRecords(entity);
    setData(allRecords);
    setTotalRecords(allRecords.length);
    setPopupOpen(false);
    setEditData(null);
  } catch (error) {
    console.error('Failed to save record:', error);
  }
};

const handleDeleteProject = async () => {
  if (selectedIds.length === 0) {
    alert('No records selected');
    return;
  }
  const confirmed = window.confirm(`Are you sure you want to delete IDs: ${selectedIds.join(', ')}?`);
  if (confirmed) {
    try {
      await deleteProjects(selectedIds);
      const allRecords = await selectAllRecords(entity);
      setData(allRecords);
      setTotalRecords(allRecords.length);
      setSelectedIds([]); 
    } catch (error) {
      console.error('Failed to delete records:', error);
    }
  }
};

  return (
    <div className="container mx-auto p-4">
      <SearchCriteria 
        entity={entity}
        onSearch={handleSearch}
        onReset={handleReset}
      />
      <SortFilter
        entity={entity}
        sortBy={sortBy}
        sortType={sortType}
        onSortChange={handleSortChange}
        onSortTypeChange={handleSortTypeChange}
        onSort={handleSort}
        onAdd={handleAdd}
        onDelete={handleDeleteProject}
      />
      <DataList 
        entity={entity}
        data={data} 
        onEdit={handleEdit} 
        onSelect={setSelectedIds} />
      <Pagination
        totalRecords={totalRecords}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
      <AddEditPopup
        entity={entity}
        isOpen={popupOpen}
        data={editData}
        onSave={handleSaveProject}
        onClose={handleClose}
      />
    </div>
  );
};

export default App;
