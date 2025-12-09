"""Comment endpoints"""

from typing import Annotated

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


def build_comment_response(row: dict, author_token: str | None, replies: list = None) -> CommentResponse:
    """Build a CommentResponse from a database row."""
    return CommentResponse(
        id=row["id"],
        document_id=row["document_id"],
        section_id=row["section_id"],
        author_name=row["author_name"],
        selected_text=row["selected_text"],
        text_offset=row["text_offset"],
        content=row["content"],
        parent_id=row["parent_id"],
        is_resolved=row["is_resolved"],
        is_internal=row["is_internal"],
        is_owner=author_token is not None and row["author_token"] == author_token,
        replies=replies or [],
        created_at=row["created_at"],
        updated_at=row["updated_at"],
    )


async def list_comments(
    document_id: Annotated[str, Parameter(query="document_id")],
    author_token: Annotated[str | None, Parameter(query="token")] = None,
    include_internal: Annotated[bool, Parameter(query="include_internal")] = False,
) -> CommentsListResponse:
    """Get all comments for a document, organized by threads."""
    query = Comment.select().where(Comment.document_id == document_id)

    # Only include internal comments if explicitly requested
    if not include_internal:
        query = query.where(Comment.is_internal == False)

    query = query.order_by(Comment.created_at, ascending=True)
    rows = await query.run()

    # Organize into threads (parent comments with their replies)
    comments_by_id = {}
    root_comments = []

    for row in rows:
        comment = build_comment_response(row, author_token, replies=[])
        comments_by_id[row["id"]] = comment

        if row["parent_id"] is None:
            root_comments.append(comment)

    # Attach replies to parents
    for row in rows:
        if row["parent_id"] is not None and row["parent_id"] in comments_by_id:
            parent = comments_by_id[row["parent_id"]]
            parent.replies.append(comments_by_id[row["id"]])

    # Sort root comments by text_offset (position in document)
    root_comments.sort(key=lambda c: (c.section_id, c.text_offset or 0, c.created_at))

    return CommentsListResponse(comments=root_comments, count=len(root_comments))


async def create_comment(data: CommentCreate) -> CommentResponse:
    """Create a new comment."""
    comment = Comment(
        document_id=data.document_id,
        section_id=data.section_id,
        author_name=data.author_name,
        author_token=data.author_token,
        selected_text=data.selected_text,
        text_offset=data.text_offset,
        content=data.content,
        parent_id=data.parent_id,
        is_internal=data.is_internal,
    )
    await comment.save().run()

    return CommentResponse(
        id=comment.id,
        document_id=comment.document_id,
        section_id=comment.section_id,
        author_name=comment.author_name,
        selected_text=comment.selected_text,
        text_offset=comment.text_offset,
        content=comment.content,
        parent_id=comment.parent_id,
        is_resolved=comment.is_resolved,
        is_internal=comment.is_internal,
        is_owner=True,
        replies=[],
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
    if data.selected_text is not None:
        comment.selected_text = data.selected_text
    if data.is_resolved is not None:
        comment.is_resolved = data.is_resolved

    await comment.save().run()

    return CommentResponse(
        id=comment.id,
        document_id=comment.document_id,
        section_id=comment.section_id,
        author_name=comment.author_name,
        selected_text=comment.selected_text,
        text_offset=comment.text_offset,
        content=comment.content,
        parent_id=comment.parent_id,
        is_resolved=comment.is_resolved,
        is_internal=comment.is_internal,
        is_owner=True,
        replies=[],
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
