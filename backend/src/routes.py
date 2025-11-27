"""Centralized route configuration for Comments API"""

from litestar import route

from controllers import comment_controller


async def health_check() -> dict:
    """Health check endpoint"""
    return {"status": "ok", "service": "comments-api"}


ALL_ROUTES = [
    # Health
    route("/health", http_method="GET", tags=["Health"])(health_check),
    # Comments - List
    route(
        "/api/comments",
        http_method="GET",
        tags=["Comments"],
    )(comment_controller.list_comments),
    # Comments - Create
    route(
        "/api/comments",
        http_method="POST",
        tags=["Comments"],
    )(comment_controller.create_comment),
    # Comments - Update
    route(
        "/api/comments/{comment_id:int}",
        http_method="PUT",
        tags=["Comments"],
    )(comment_controller.update_comment),
    # Comments - Delete
    route(
        "/api/comments/{comment_id:int}",
        http_method="DELETE",
        tags=["Comments"],
    )(comment_controller.delete_comment),
]
