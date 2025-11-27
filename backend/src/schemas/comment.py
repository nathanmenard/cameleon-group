"""Pydantic schemas for comments API"""

from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, Field


# Field type aliases
AuthorName = Annotated[
    str,
    Field(
        min_length=1,
        max_length=100,
        description="Nom de l'auteur",
        examples=["Jean Dupont"],
    ),
]

AuthorToken = Annotated[
    str,
    Field(
        min_length=32,
        max_length=64,
        description="Token d'identification",
    ),
]

DocumentId = Annotated[
    str,
    Field(
        min_length=1,
        max_length=100,
        description="Identifiant du document",
        examples=["cameleon-group-note"],
    ),
]

SectionId = Annotated[
    str,
    Field(
        min_length=1,
        max_length=100,
        description="Identifiant de la section",
        examples=["ambition", "forces"],
    ),
]


class CommentCreate(BaseModel):
    """Create a new comment or reaction"""

    document_id: DocumentId
    section_id: SectionId
    author_name: AuthorName
    author_token: AuthorToken
    content: str | None = Field(
        default=None,
        max_length=2000,
        description="Texte du commentaire",
    )
    emoji: str | None = Field(
        default=None,
        max_length=10,
        description="Emoji de réaction",
        examples=["👍", "👎", "❓", "💡"],
    )
    is_internal: bool = Field(
        default=False,
        description="Commentaire confidentiel (visible uniquement par Drakkar)",
    )


class CommentUpdate(BaseModel):
    """Update an existing comment"""

    author_token: AuthorToken
    content: str | None = Field(
        default=None,
        max_length=2000,
        description="Texte du commentaire",
    )
    emoji: str | None = Field(
        default=None,
        max_length=10,
        description="Emoji de réaction",
    )
    is_internal: bool | None = Field(
        default=None,
        description="Commentaire confidentiel",
    )


class CommentDelete(BaseModel):
    """Delete request with auth token"""

    author_token: AuthorToken


class CommentResponse(BaseModel):
    """Comment in API responses"""

    id: int
    document_id: str
    section_id: str
    author_name: str
    content: str | None
    emoji: str | None
    is_internal: bool
    is_owner: bool = False  # Set based on request token
    created_at: datetime
    updated_at: datetime


class CommentsListResponse(BaseModel):
    """List of comments for a document"""

    comments: list[CommentResponse]
    count: int
