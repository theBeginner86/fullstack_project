from fastapi import HTTPException, Query, APIRouter
from prisma import Prisma
from Models.models import Mentor, MentorCreate, MentorUpdate

router = APIRouter()
prisma = Prisma()

@router.on_event("startup")
async def startup():
    await prisma.connect()

###################### MENTOR TABLE CRUD ###################

# Insert a new mentor record
@router.post("/mentors", response_model=Mentor)
async def insert_mentor(mentor: MentorCreate):
    try:
        new_mentor = await prisma.mentor.create(data=mentor.dict(exclude_unset=True))
        return new_mentor
    except Exception as e:
        if "Unique constraint failed" in str(e):
            raise HTTPException(status_code=400, detail="Mentor ID already exists")
        elif "foreign constraint failed" in str(e):
            raise HTTPException(status_code=400, detail="Organization does not exist")
        else:
            raise HTTPException(status_code=500, detail=f"Failed to insert mentor: {str(e)}")

# Update a record
@router.put("/mentors/{mentor_id}", response_model=Mentor)
async def update_mentor(mentor_id: int, mentor: MentorUpdate):
    updated_mentor = await prisma.mentor.update(
        where={"MentorID": mentor_id},
        data=mentor.dict(exclude_unset=True)
    )
    if not updated_mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
    return updated_mentor

# Delete a record based on index
@router.delete("/mentors", response_model=Mentor)
async def delete_students(mentor_id: int= Query(...)):
    deleted_mentor = await prisma.mentor.delete(where={"MentorID": mentor_id})
    if not deleted_mentor:
        raise HTTPException(status_code=404, detail=f"Mentor with ID {mentor_id} not found")
    return deleted_mentor