-- Create comment table for document feedback
CREATE TABLE IF NOT EXISTS comment (
    id SERIAL PRIMARY KEY,
    document_id VARCHAR(100) NOT NULL,
    section_id VARCHAR(100) NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    author_token VARCHAR(64) NOT NULL,
    content TEXT,
    emoji VARCHAR(10),
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_comment_document_id ON comment(document_id);
CREATE INDEX IF NOT EXISTS idx_comment_section_id ON comment(section_id);
CREATE INDEX IF NOT EXISTS idx_comment_author_token ON comment(author_token);

-- Check constraint: must have either content or emoji
ALTER TABLE comment ADD CONSTRAINT check_content_or_emoji
    CHECK (content IS NOT NULL OR emoji IS NOT NULL);
