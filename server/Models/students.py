from fastapi import HTTPException, Query, APIRouter
from prisma import Prisma
from Models.models import Student,StudentCreate,StudentUpdate

router = APIRouter()
prisma = Prisma()

@router.on_event("startup")
async def startup():
    await prisma.connect()

###################### STUDENT TABLE CRUD ###################

# Insert a new student record
@router.post("/students", response_model=Student)
async def insert_student(student: StudentCreate):
    try:
        new_student = await prisma.student.create(data=student.dict())
        return new_student
    except Exception as e:
        if "Unique constraint failed" in str(e):
            raise HTTPException(status_code=400, detail="Student ID already exists")
        else:
            raise HTTPException(status_code=500, detail="Failed to insert student")

# Update a record
@router.put("/students/{student_id}", response_model=Student)
async def update_student(student_id: int, student: StudentUpdate):
    updated_student = await prisma.student.update(
        where={"ID": student_id},
        data=student.dict(exclude_unset=True)
    )
    if not updated_student:
        raise HTTPException(status_code=404, detail="Student not found")
    return updated_student

# Delete a record based on index
@router.delete("/students", response_model=Student)
async def delete_students(student_id:int= Query(...)):
    deleted_student = await prisma.student.delete(where={"ID": student_id})
    if not deleted_student:
        raise HTTPException(status_code=404, detail=f"Student with ID {student_id} not found")
    return deleted_student