from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from Models.students import router as students_router
from Models.mentors import router as mentors_router
from Models.projects import router as projects_router
from Models.organizations import router as organizations_router
from Models.common import router as common_router
import os
import logging
import sys
import uvicorn

load_dotenv()
print(os.getenv("DATABASE_URL"))

# Enable Prisma query logging
logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(students_router, tags=["students"])
app.include_router(mentors_router, tags=["mentors"])
app.include_router(projects_router, tags=["projects"])
app.include_router(organizations_router, tags=["organizations"])
app.include_router(common_router, tags=["common"])


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)