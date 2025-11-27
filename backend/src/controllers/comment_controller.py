"""Comment endpoints"""

from typing import Annotated

from litestar import Request
from litestar.exceptions import HTTPException, NotFoundException
from litestar.params import Parameter

from models import Comment
from schemas.comment import (
    CommentCreate,
    CommentDelete,
    CommentResponse,
    CommentsListResponse,
    CommentUpdate,
)


async def list_comments(
    document_id: Annotated[str, Parameter(query="document_id")],
    section_id: Annotated[str | None, Parameter(query="section_id")] = None,
    author_token: Annotated[str | None, Parameter(query="token")] = None,
    include_internal: Annotated[bool, Parameter(query="include_internal")] = False,
) -> CommentsListResponse:
    """Get all comments for a document, optionally filtered by section."""
    query = Comment.select().where(Comment.document_id == document_id)

    if section_id:
        query = query.where(Comment.section_id == section_id)

    # Only include internal comments if explicitly requested
    if not include_internal:
        query = query.where(Comment.is_internal == False)

    query = query.order_by(Comment.created_at, ascending=True)
    rows = await query.run()

    comments = [
        CommentResponse(
            id=row["id"],
            document_id=row["document_id"],
            section_id=row["section_id"],
            author_name=row["author_name"],
            content=row["content"],
            emoji=row["emoji"],
            is_internal=row["is_internal"],
            is_owner=author_token is not None and row["author_token"] == author_token,
            created_at=row["created_at"],
            updated_at=row["updated_at"],
        )
        for row in rows
    ]

    return CommentsListResponse(comments=comments, count=len(comments))


async def create_comment(data: CommentCreate) -> CommentResponse:
    """Create a new comment or reaction."""
    # Validate: must have either content or emoji
    if not data.content and not data.emoji:
        raise HTTPException(
            status_code=400,
            detail="Un commentaire doit contenir du texte ou un emoji",
        )

    comment = Comment(
        document_id=data.document_id,
        section_id=data.section_id,
        author_name=data.author_name,
        author_token=data.author_token,
        content=data.content,
        emoji=data.emoji,
        is_internal=data.is_internal,
    )
    await comment.save().run()

    return CommentResponse(
        id=comment.id,
        document_id=comment.document_id,
        section_id=comment.section_id,
        author_name=comment.author_name,
        content=comment.content,
        emoji=comment.emoji,
        is_internal=comment.is_internal,
        is_owner=True,
        created_at=comment.created_at,
        updated_at=comment.updated_at,
    )


async def update_comment(
    comment_id: int,
    data: CommentUpdate,
) -> CommentResponse:
    """Update an existing comment (requires matching author_token)."""
    comment = await Comment.objects().get(Comment.id == comment_id).run()

    if not comment:
        raise NotFoundException(detail="Commentaire non trouvé")

    if comment.author_token != data.author_token:
        raise HTTPException(
            status_code=403,
            detail="Vous n'êtes pas autorisé à modifier ce commentaire",
        )

    # Update fields if provided
    if data.content is not None:
        comment.content = data.content
    if data.emoji is not None:
        comment.emoji = data.emoji
    if data.is_internal is not None:
        comment.is_internal = data.is_internal

    await comment.save().run()

    return CommentResponse(
        id=comment.id,
        document_id=comment.document_id,
        section_id=comment.section_id,
        author_name=comment.author_name,
        content=comment.content,
        emoji=comment.emoji,
        is_internal=comment.is_internal,
        is_owner=True,
        created_at=comment.created_at,
        updated_at=comment.updated_at,
    )


async def delete_comment(
    comment_id: int,
    data: CommentDelete,
) -> dict:
    """Delete a comment (requires matching author_token)."""
    comment = await Comment.objects().get(Comment.id == comment_id).run()

    if not comment:
        raise NotFoundException(detail="Commentaire non trouvé")

    if comment.author_token != data.author_token:
        raise HTTPException(
            status_code=403,
            detail="Vous n'êtes pas autorisé à supprimer ce commentaire",
        )

    await comment.remove().run()

    return {"success": True, "message": "Commentaire supprimé"}
