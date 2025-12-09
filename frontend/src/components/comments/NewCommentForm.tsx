"use client";

import { useState, useRef, useEffect } from "react";
import { useCommentsStore } from "@/stores/useCommentsStore";
import { useUser } from "@/hooks/useUser";

interface NewCommentFormProps {
  onSubmit: (data: {
    content: string;
    authorName: string;
    isInternal: boolean;
  }) => Promise<void>;
  onCancel: () => void;
}

export function NewCommentForm({ onSubmit, onCancel }: NewCommentFormProps) {
  const { currentSelection, currentBlockSelection } = useCommentsStore();
  const { user, login } = useUser();

  const displayText = currentSelection?.text || currentBlockSelection?.blockText || "";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [content, setContent] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const firstNameInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus
  useEffect(() => {
    setTimeout(() => {
      if (user) {
        textareaRef.current?.focus();
      } else {
        firstNameInputRef.current?.focus();
      }
    }, 50);
  }, [user]);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    let authorName: string;
    if (user) {
      authorName = `${user.firstName} ${user.lastName}`;
    } else {
      if (!firstName.trim() || !lastName.trim() || !company.trim()) return;
      const newUser = login({ firstName: firstName.trim(), lastName: lastName.trim(), company: company.trim() });
      authorName = `${newUser.firstName} ${newUser.lastName}`;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        content: content.trim(),
        authorName,
        isInternal,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      onCancel();
    }
  };

  const canSubmit = content.trim() && (user || (firstName.trim() && lastName.trim() && company.trim()));

  return (
    <div style={{
      padding: "12px 16px",
      borderBottom: "1px solid #f0f0f0",
      backgroundColor: "#fff",
    }}>
      {/* Quote - très compact */}
      {displayText && (
        <div style={{ marginBottom: "10px" }}>
          <div style={{
            fontSize: "12px",
            color: "#888",
            paddingLeft: "10px",
            borderLeft: "2px solid #B22222",
            lineHeight: 1.4,
            fontStyle: "italic",
          }}>
            {displayText.length > 60 ? `${displayText.substring(0, 60)}...` : displayText}
          </div>
          <div style={{
            fontSize: "10px",
            color: "#bbb",
            marginTop: "4px",
            paddingLeft: "10px",
          }}>
            Sélectionnez du texte pour modifier
          </div>
        </div>
      )}

      {/* Zone de saisie principale */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}>
        {/* Nom si pas connecté */}
        {!user && (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                ref={firstNameInputRef}
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Prénom"
                style={{
                  flex: 1,
                  padding: "8px 0",
                  fontSize: "13px",
                  border: "none",
                  borderBottom: "1px solid #e8e8e8",
                  outline: "none",
                  fontFamily: "inherit",
                  color: "#333",
                  backgroundColor: "transparent",
                }}
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nom"
                style={{
                  flex: 1,
                  padding: "8px 0",
                  fontSize: "13px",
                  border: "none",
                  borderBottom: "1px solid #e8e8e8",
                  outline: "none",
                  fontFamily: "inherit",
                  color: "#333",
                  backgroundColor: "transparent",
                }}
              />
            </div>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Entreprise"
              style={{
                width: "100%",
                padding: "8px 0",
                fontSize: "13px",
                border: "none",
                borderBottom: "1px solid #e8e8e8",
                outline: "none",
                fontFamily: "inherit",
                color: "#333",
                backgroundColor: "transparent",
              }}
            />
          </div>
        )}

        {/* Textarea - le focus principal */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ajouter un commentaire..."
          rows={2}
          style={{
            width: "100%",
            padding: "0",
            fontSize: "13px",
            border: "none",
            outline: "none",
            resize: "none",
            fontFamily: "inherit",
            lineHeight: 1.5,
            color: "#333",
            backgroundColor: "transparent",
          }}
        />

        {/* Actions - minimaliste */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "4px",
        }}>
          <label style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            cursor: "pointer",
            fontSize: "11px",
            color: isInternal ? "#B22222" : "#aaa",
            userSelect: "none",
          }}>
            <input
              type="checkbox"
              checked={isInternal}
              onChange={(e) => setIsInternal(e.target.checked)}
              style={{ display: "none" }}
            />
            <span style={{
              width: "14px",
              height: "14px",
              borderRadius: "3px",
              border: isInternal ? "none" : "1px solid #ddd",
              backgroundColor: isInternal ? "#B22222" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {isInternal && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </span>
            Interne
          </label>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                fontSize: "12px",
                color: "#999",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 8px",
              }}
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              style={{
                fontSize: "12px",
                fontWeight: 500,
                color: canSubmit ? "#fff" : "#999",
                backgroundColor: canSubmit ? "#0a0a0a" : "#f0f0f0",
                padding: "5px 12px",
                borderRadius: "4px",
                border: "none",
                cursor: canSubmit ? "pointer" : "default",
                transition: "all 0.15s",
              }}
            >
              {isSubmitting ? "..." : "Envoyer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewCommentForm;
