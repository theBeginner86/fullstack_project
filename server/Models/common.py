from fastapi import APIRouter
from prisma import Prisma
from typing import List
from Models.models import EntityResponse, Student,Mentor,Project,Organization
from Models.config import columns_mapping

router = APIRouter()
prisma = Prisma()

@router.on_event("startup")
async def startup():
    await prisma.connect()

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

# Endpoint to fetch columns for a specific entity
@router.get("/{entity}/columns", response_model=List[str])
async def fetch_entity_columns(entity: str):
    if entity in columns_mapping:
        return columns_mapping[entity]
    else:
        return []

# Fetch records based on a particular column's value
@router.get("/search")
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


# Sort by a particular column and order
@router.get("/sort", response_model=EntityResponse)
async def sort_records(entity: str, column: str, order: str):
    if entity not in entity_models:
        return {"error": f"Unknown entity '{entity}'."}

    model = entity_models[entity]

    order_direction = "asc" if order == "ascending" else "desc"
    sortedRecords = await model.find_many(
        order={column: order_direction}
    )
    return sortedRecords

# Select all records in the table
@router.get("/all", response_model=EntityResponse)
async def select_all_students(entity: str):
    if entity not in entity_models:
        return {"error": f"Unknown entity '{entity}'."}

    model = entity_models[entity]
    allRecords = await model.find_many()
    return allRecords