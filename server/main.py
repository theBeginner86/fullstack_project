from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Union
from pydantic import BaseModel
from prisma import Prisma

from dotenv import load_dotenv
import os

load_dotenv()
print(os.getenv("DATABASE_URL"))

import logging
import sys

# Enable Prisma query logging
logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)


app = FastAPI()
prisma = Prisma()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await prisma.connect()

@app.on_event("shutdown")
async def shutdown():
    await prisma.disconnect()

class StudentBase(BaseModel):
    ID: Optional[int]
    Name: Optional[str]
    eMail: Optional[str]
    Mobile: Optional[str]
    College: Optional[str] = None
    Yr_Start: Optional[int] 
    Yr_End: Optional[int] 
    Degree: Optional[str] = None
    Branch: Optional[str] = None
    Electives: Optional[str] = None
    Interests: Optional[str] = None
    MentorID: Optional[int] 

class StudentCreate(StudentBase):
    pass

class StudentUpdate(StudentBase):
    pass

class Student(StudentBase):
    ID: int

    class Config:
        orm_mode = True

class MentorBase(BaseModel):
    MentorID: Optional[int]
    Name: Optional[str]
    eMail: Optional[str]
    Mobile: Optional[str]
    Specialization: Optional[str]
    Availability: Optional[str]
    LinkedIn: Optional[str]
    Organization: Optional[str]
    OrganizationID: Optional[int]

class MentorCreate(MentorBase):
    pass

class MentorUpdate(MentorBase):
    pass

class Mentor(MentorBase):
    MentorID: int

    class Config:
        orm_mode = True

class ProjectBase(BaseModel):
    ProjectID: Optional[int]
    Title: Optional[str]
    Description: Optional[str]
    Approach: Optional[str]
    Skills: Optional[str]
    HW_Needed: Optional[str]
    Milestones: Optional[str]

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    pass

class Project(ProjectBase):
    ProjectID: int

    class Config:
        orm_mode = True

class OrganizationBase(BaseModel):
    OrganizationID: Optional[int]
    Name: str
    Description: Optional[str]
    Website: Optional[str]

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationUpdate(OrganizationBase):
    pass

class Organization(OrganizationBase):
    OrganizationID: int

    class Config:
        orm_mode = True

EntityResponse = Union[List[Student], List[Mentor], List[Project], List[Organization]]


# Define columns for different entities
columns_mapping = {
    "students": [
        "ID",
        "Name",
        "eMail",
        "Mobile",
        "College",
        "Yr_Start",
        "Yr_End",
        "Degree",
        "Branch",
        "Electives",
        "Interests",
        "MentorID"
    ],
    "mentors": [
        "MentorID",
        "Name",
        "eMail",
        "Mobile",
        "Specialization",
        "Availability",
        "LinkedIn",
        "Organization",
        "OrganizationID"
    ],
    "projects": [
        "ProjectID",
        "Title",
        "Description",
        "Approach",
        "Skills",
        "HW_Needed",
        "Milestones"
    ],
    "organizations": [
        "OrganizationID",
        "Name",
        "Description",
        "Website"
    ]
}

# Endpoint to fetch columns for a specific entity
@app.get("/{entity}/columns", response_model=List[str])
async def fetch_entity_columns(entity: str):
    if entity in columns_mapping:
        return columns_mapping[entity]
    else:
        return []

entity_models = {
        "students": prisma.student,
        "mentors": prisma.mentor,
        "projects": prisma.project,
        "organizations": prisma.organization
    }

res_models = {
    "students": Student,
    "mentors": Mentor,
    "projects": Project,
    "organizations": Organization,
}

# Fetch records based on a particular column's value
@app.get("/search")
async def search_records(entity: str, column: str, value: str):

    if entity not in entity_models:
        return {"error": f"Unknown entity '{entity}'."}

    model = entity_models[entity]

    where_filter = {}

    # Check if the column requires integer type
    integer_columns = {
        "students": ["ID", "Yr_Start", "Yr_End", "MentorID"],
        "mentors": ["MentorID", "OrganizationID"],
        "projects": ["ProjectID"],
        "organizations": ["OrganizationID"]
    }

    if column in integer_columns.get(entity, []):
        try:
            value = int(value)  # Convert value to integer
        except ValueError:
            return {"error": f"Invalid value '{value}' for column '{column}'. Must be an integer."}

    # Add the filter condition based on column and value
    where_filter[column] = value

    try:
        records = await model.find_many(where=where_filter)
        return records
    except Exception as e:
        return {"error": str(e)}


# 3. Sort by a particular column and order
@app.get("/sort", response_model=EntityResponse)
async def sort_records(entity: str, column: str, order: str):
    if entity not in entity_models:
        return {"error": f"Unknown entity '{entity}'."}

    model = entity_models[entity]

    order_direction = "asc" if order == "ascending" else "desc"
    sortedRecords = await model.find_many(
        order={column: order_direction}
    )
    return sortedRecords

# 4. Select all records in the table
@app.get("/all", response_model=EntityResponse)
async def select_all_students(entity: str):
    if entity not in entity_models:
        return {"error": f"Unknown entity '{entity}'."}

    model = entity_models[entity]
    allRecords = await model.find_many()
    return allRecords

###################### STUDENT TABLE CRUD ###################
# 5. Insert a new student record
@app.post("/students", response_model=Student)
async def insert_student(student: StudentCreate):
    try:
        new_student = await prisma.student.create(data=student.dict())
        return new_student
    except Exception as e:
        if "Unique constraint failed" in str(e):
            raise HTTPException(status_code=400, detail="Student ID already exists")
        else:
            raise HTTPException(status_code=500, detail="Failed to insert student")

# 6. Delete a record based on index
@app.delete("/students", response_model=Student)
async def delete_students(student_id:int= Query(...)):
    deleted_student = await prisma.student.delete(where={"ID": student_id})
    if not deleted_student:
        raise HTTPException(status_code=404, detail=f"Student with ID {student_id} not found")
    return deleted_student

# 8. Update a record
@app.put("/students/{student_id}", response_model=Student)
async def update_student(student_id: int, student: StudentUpdate):
    updated_student = await prisma.student.update(
        where={"ID": student_id},
        data=student.dict(exclude_unset=True)
    )
    if not updated_student:
        raise HTTPException(status_code=404, detail="Student not found")
    return updated_student


###################### MENTOR TABLE CRUD ###################
# 5. Insert a new mentor record
@app.post("/mentors", response_model=Mentor)
async def insert_mentor(mentor: MentorCreate):
    try:
        new_mentor = await prisma.mentor.create(data=mentor.dict(exclude_unset=True))
        return new_mentor
    except Exception as e:
        if "Unique constraint failed" in str(e):
            raise HTTPException(status_code=400, detail="Mentor ID already exists")
        else:
            raise HTTPException(status_code=500, detail="Failed to insert mentor")

# 8. Update a record
@app.put("/mentors/{mentor_id}", response_model=Mentor)
async def update_mentor(mentor_id: int, mentor: MentorUpdate):
    updated_mentor = await prisma.mentor.update(
        where={"MentorID": mentor_id},
        data=mentor.dict(exclude_unset=True)
    )
    if not updated_mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    return updated_mentor

# 6. Delete a record based on index
@app.delete("/mentors", response_model=Mentor)
async def delete_students(mentor_id: int= Query(...)):
    deleted_mentor = await prisma.mentor.delete(where={"MentorID": mentor_id})
    if not deleted_mentor:
        raise HTTPException(status_code=404, detail=f"Mentor with ID {mentor_id} not found")
    return deleted_mentor

###################### PROJECT TABLE CRUD ###################
# 5. Insert a new mentor record
@app.post("/projects", response_model=Project)
async def insert_project(project: ProjectCreate):
    try:
        new_project = await prisma.project.create(data=project.dict())
        return new_project
    except Exception as e:
        if "Unique constraint failed" in str(e):
            raise HTTPException(status_code=400, detail="Project ID already exists")
        else:
            raise HTTPException(status_code=500, detail="Failed to insert project")

# 8. Update a record
@app.put("/projects/{project_id}", response_model=Project)
async def update_project(project_id: int, project: ProjectUpdate):
    updated_project = await prisma.project.update(
        where={"ProjectID": project_id},
        data=project.dict(exclude_unset=True)
    )
    if not updated_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return updated_project

# 6. Delete a record based on index
@app.delete("/projects", response_model=Project)
async def delete_students(project_id: int= Query(...)):
    deleted_project = await prisma.project.delete(where={"ProjectID": project_id})
    if not deleted_project:
        raise HTTPException(status_code=404, detail=f"Project with ID {project_id} not found")
    return deleted_project

###################### ORGANIZATION TABLE CRUD ###################
# Insert a new organization record
@app.post("/organizations", response_model=Organization)
async def insert_organization(organization: OrganizationCreate):
    try:
        new_organization = await prisma.organization.create(data=organization.dict())
        return new_organization
    except Exception as e:
        if "Unique constraint failed" in str(e):
            raise HTTPException(status_code=400, detail="Organization ID already exists")
        else:
            raise HTTPException(status_code=500, detail="Failed to insert organization")

# Update an organization record
@app.put("/organizations/{organization_id}", response_model=Organization)
async def update_organization(organization_id: int, organization: OrganizationUpdate):
    updated_organization = await prisma.organization.update(
        where={"OrganizationID": organization_id},
        data=organization.dict(exclude_unset=True)
    )
    if not updated_organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    return updated_organization

# Delete an organization record based on index
@app.delete("/organizations", response_model=Organization)
async def delete_organization(organization_id: int = Query(...)):
    deleted_organization = await prisma.organization.delete(where={"OrganizationID": organization_id})
    if not deleted_organization:
        raise HTTPException(status_code=404, detail=f"Organization with ID {organization_id} not found")
    return deleted_organization

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)