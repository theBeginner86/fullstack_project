from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
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
    Name: Optional[str]
    eMail: Optional[str]
    Mobile: Optional[str]
    College: Optional[str]
    Yr_Start: Optional[int]
    Yr_End: Optional[int]
    Degree: Optional[str]
    Branch: Optional[str]
    Electives: Optional[str]
    Interests: Optional[str]
    MentorID: Optional[int]

class StudentCreate(StudentBase):
    pass

class StudentUpdate(StudentBase):
    pass

class Student(StudentBase):
    ID: int

    class Config:
        orm_mode = True

# 1. Fetch all columns in the student table
@app.get("/students/columns", response_model=List[str])
async def fetch_student_columns():
    columns = [
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
    ]
    return columns

# Fetch records based on a particular column's value
@app.get("/students/search")
async def search_students(column: str = Query(...), value: str = Query(...)):
    where_filter = {}

    # Check if the column requires integer type
    if column in ["ID", "Yr_Start", "Yr_End", "MentorID"]:
        try:
            value = int(value)  # Convert value to integer
        except ValueError:
            return {"error": f"Invalid value '{value}' for column '{column}'. Must be an integer."}

    # Add the filter condition based on column and value
    where_filter[column] = value

    try:
        students = await prisma.student.find_many(where=where_filter)
        return students
    except Exception as e:
        return {"error": str(e)}

# 3. Sort by a particular column and order
@app.get("/students/sort", response_model=List[Student])
async def sort_students(column: str, order: str):
    order_direction = "asc" if order == "ascending" else "desc"
    students = await prisma.student.find_many(
        order={column: order_direction}
    )
    return students

# 4. Select all records in the student table
@app.get("/students/all", response_model=List[Student])
async def select_all_students():
    students = await prisma.student.find_many()
    return students

# 5. Insert a new student record
@app.post("/students", response_model=Student)
async def insert_student(student: StudentCreate):
    new_student = await prisma.student.create(data=student.dict())
    return new_student

# 6. Delete a record based on index
@app.delete("/students", response_model=List[Student])
async def delete_students(student_ids: List[int]):
    deleted_students = []
    for student_id in student_ids:
        deleted_student = await prisma.student.delete(where={"ID": student_id})
        if not deleted_student:
            raise HTTPException(status_code=404, detail=f"Student with ID {student_id} not found")
        deleted_students.append(deleted_student)
    return deleted_students

# 7. Fetch all column values for a particular record
@app.get("/students/{student_id}", response_model=Student)
async def fetch_student_by_id(student_id: int):
    student = await prisma.student.find_unique(where={"ID": student_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

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
