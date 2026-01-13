from pydantic import BaseModel, Field, ConfigDict
from typing import List

class SubSection(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str
    data: List[str] = Field(default_factory=list)

class Section(BaseModel):
    model_config = ConfigDict(extra="forbid")

    section_name: str
    subsections: List[SubSection] = Field(default_factory=list)

class ResumeJSON(BaseModel):
    model_config = ConfigDict(extra="forbid")

    sections: List[Section]