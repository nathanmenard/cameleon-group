import type { Author, DocumentMeta } from "@/types/document";

interface SignatureProps {
  meta: DocumentMeta;
}

export function Signature({ meta }: SignatureProps) {
  return (
    <div className="signature">
      <div className="signature-header">
        <div className="signature-meta">
          <div className="signature-company">Drakkar Group</div>
          <div className="signature-date">{meta.date}</div>
        </div>
        <div className="signature-logo">
          <img src={meta.logo.black} alt="Drakkar" />
        </div>
      </div>

      <div className="authors">
        {meta.authors.map((author) => (
          <AuthorCard key={author.email} author={author} />
        ))}
      </div>
    </div>
  );
}

function AuthorCard({ author }: { author: Author }) {
  return (
    <div className="author">
      <img src={author.photo} alt={author.name} className="author-photo" />
      <div className="author-info">
        <div className="author-name">{author.name}</div>
        <div className="author-role">{author.role}</div>
        <div className="author-contact">
          <a href={`mailto:${author.email}`}>{author.email}</a>
          <a href={`tel:${author.phone.replace(/\s/g, "")}`}>{author.phone}</a>
          {author.note && (
            <a href={`sms:${author.phone.replace(/\s/g, "")}`} className="author-note">
              {author.note}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
