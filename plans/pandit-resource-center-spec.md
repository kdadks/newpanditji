# Pandit Resource Center – Page Specification

## 1. Overview
A modular, drag‑and‑drop editable page built on the existing CMS. Administrators can add, remove, or reorder modules via a “+” button. Each module contains a header, rich‑text content, media gallery, and file attachments.

---

## 2. JSON Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Pandit Resource Center Page",
  "type": "object",
  "required": ["modules"],
  "properties": {
    "modules": {
      "type": "array",
      "items": { "$ref": "#/definitions/Module" }
    }
  },
  "definitions": {
    "Module": {
      "type": "object",
      "required": ["id", "type", "header", "content"],
      "properties": {
        "id": { "type": "string", "format": "uuid" },
        "type": { "type": "string", "enum": ["text", "mediaGallery", "fileAttachments"] },
        "order": { "type": "integer", "minimum": 0 },
        "header": { "$ref": "#/definitions/ModuleHeader" },
        "content": {
          "oneOf": [
            { "$ref": "#/definitions/RichTextContent" },
            { "$ref": "#/definitions/MediaGalleryContent" },
            { "$ref": "#/definitions/FileAttachmentsContent" }
          ]
        }
      }
    },
    "ModuleHeader": {
      "type": "object",
      "required": ["title"],
      "properties": {
        "title": { "type": "string", "maxLength": 100 },
        "subtitle": { "type": "string", "maxLength": 200 }
      }
    },
    "RichTextContent": {
      "type": "object",
      "required": ["html"],
      "properties": {
        "html": { "type": "string" },
        "draftId": { "type": "string", "format": "uuid" },
        "versionHistory": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["version", "timestamp", "authorId"],
            "properties": {
              "version": { "type": "integer" },
              "timestamp": { "type": "string", "format": "date-time" },
              "authorId": { "type": "string", "format": "uuid" },
              "summary": { "type": "string", "maxLength": 200 }
            }
          }
        }
      }
    },
    "MediaGalleryContent": {
      "type": "object",
      "properties": {
        "videos": { "type": "array", "maxItems": 3, "items": { "$ref": "#/definitions/VideoEntry" } },
        "photos": { "type": "array", "maxItems": 3, "items": { "$ref": "#/definitions/PhotoEntry" } }
      }
    },
    "VideoEntry": {
      "type": "object",
      "required": ["url", "title"],
      "properties": {
        "url": { "type": "string", "format": "uri", "pattern": "^https?://(www\\.)?youtube\\.com/watch\\?v=[\\w-]{11}$" },
        "title": { "type": "string", "maxLength": 80 },
        "caption": { "type": "string", "maxLength": 150 },
        "thumbnail": { "type": "string", "format": "uri" }
      }
    },
    "PhotoEntry": {
      "type": "object",
      "required": ["src", "title", "alt"],
      "properties": {
        "src": { "type": "string", "format": "uri" },
        "title": { "type": "string", "maxLength": 80 },
        "caption": { "type": "string", "maxLength": 150 },
        "alt": { "type": "string", "maxLength": 125 },
        "sizeBytes": { "type": "integer", "maximum": 5242880 }
      }
    },
    "FileAttachmentsContent": {
      "type": "object",
      "properties": {
        "files": { "type": "array", "maxItems": 10, "items": { "$ref": "#/definitions/FileEntry" } }
      }
    },
    "FileEntry": {
      "type": "object",
      "required": ["url", "title"],
      "properties": {
        "url": { "type": "string", "format": "uri" },
        "title": { "type": "string", "maxLength": 100 },
        "description": { "type": "string", "maxLength": 200 },
        "sizeBytes": { "type": "integer", "maximum": 20971520 },
        "mimeType": {
          "type": "string",
          "enum": [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/zip"
          ]
        },
        "hash": { "type": "string" }
      }
    }
  }
}
```

---

## 3. React Component Props
### 3.1 Common Header
```ts
export interface ModuleHeaderProps {
  title: string;
  subtitle?: string;
  onChange: (header: { title: string; subtitle?: string }) => void;
}
```

### 3.2 Text Module
```ts
export interface TextModuleProps {
  id: string;
  header: ModuleHeaderProps;
  html: string;
  draftId?: string;
  versionHistory?: Array<{ version: number; timestamp: string; authorId: string; summary?: string }>;
  onSave: (payload: { html: string; draftId?: string }) => Promise<void>;
  errors?: { html?: string };
}
```

### 3.3 Media Gallery Module
```ts
export interface VideoEntry { url: string; title: string; caption?: string; thumbnail?: string; }
export interface PhotoEntry { src: string; title: string; caption?: string; alt: string; sizeBytes?: number; }

export interface MediaGalleryModuleProps {
  id: string;
  header: ModuleHeaderProps;
  videos: VideoEntry[];
  photos: PhotoEntry[];
  onAddVideo: (v: VideoEntry) => void;
  onRemoveVideo: (i: number) => void;
  onAddPhoto: (p: PhotoEntry) => void;
  onRemovePhoto: (i: number) => void;
  errors?: { videos?: string[]; photos?: string[] };
}
```

### 3.4 File Attachments Module
```ts
export interface FileEntry {
  url: string;
  title: string;
  description?: string;
  sizeBytes?: number;
  mimeType: string;
  hash: string;
}
export interface FileAttachmentsModuleProps {
  id: string;
  header: ModuleHeaderProps;
  files: FileEntry[];
  onAddFiles: (files: FileEntry[]) => void;
  onRemoveFile: (i: number) => void;
  errors?: { files?: string[] };
}
```

### 3.5 Module Container (ordering)
```ts
export interface ModuleContainerProps {
  modules: Array<
    { type: 'text'; props: TextModuleProps } |
    { type: 'mediaGallery'; props: MediaGalleryModuleProps } |
    { type: 'fileAttachments'; props: FileAttachmentsModuleProps }
  >;
  onAddModule: (type: 'text' | 'mediaGallery' | 'fileAttachments') => void;
  onRemoveModule: (id: string) => void;
  onReorder: (newOrder: string[]) => void;
}
```

---

## 4. API Endpoints (Supabase Edge Functions)
| Method | Path | Purpose | Request | Response |
|--------|------|---------|---------|----------|
| POST | `/api/media/upload` | Upload image or document | `multipart/form-data` (file, moduleId, type) | `{ success:true, url:string, size:number, mimeType:string, hash:string }` |
| POST | `/api/media/youtube` | Store YouTube video entry | `{ moduleId:string, url:string, title:string, caption?:string }` | `{ success:true, videoId:string, thumbnail:string }` |
| GET | `/api/media/:moduleId` | List media for a module | – | `{ photos: PhotoEntry[], videos: VideoEntry[] }` |
| DELETE | `/api/media/:moduleId/photo/:photoId` | Delete a photo | – | `{ success:true }` |
| DELETE | `/api/media/:moduleId/video/:videoId` | Delete a video | – | `{ success:true }` |
| POST | `/api/files/attach` | Upload document | `multipart/form-data` (file, moduleId) | `{ success:true, fileId:string, url:string, size:number, mimeType:string, hash:string }` |
| GET | `/api/files/:moduleId` | List attached files | – | `{ files: FileEntry[] }` |
| DELETE | `/api/files/:moduleId/:fileId` | Delete a file | – | `{ success:true }` |

All endpoints enforce role‑based RLS (`editor`/`admin` can modify, `viewer` read‑only). Rate limiting: max 10 uploads/min per user.

---

## 5. Validation & Constraints
*Client‑side* uses Yup schemas that mirror the JSON limits (title ≤ 100 chars, image ≤ 5 MB, video URL pattern, etc.).
*Server‑side* enforces the same limits via Supabase RLS and Edge Function checks, duplicate detection by SHA‑256 hash, and transactional integrity.
Rich‑text drafts are auto‑saved; version history keeps the last 20 versions.

---

## 6. Accessibility & UI Interaction Guidelines
- Keyboard‑only navigation (`Tab`, `Enter`, arrow keys for drag‑and‑drop).
- All controls have descriptive `aria-label`s; drag handles have `role="button"` and announce position changes via an `aria-live` region.
- Images require `alt` text (≤ 125 chars); video captions are optional but provided.
- Live status region announces saves, deletions, and duplicate warnings.
- Errors use `role="alert"`.

---

## 7. Layout & Responsiveness
| Device | Layout |
|--------|--------|
| **Desktop (≥ 768 px)** | Two‑column grid inside each module: videos left, photos right; rich‑text spans full width above. |
| **Mobile (< 768 px)** | Stacked vertical flow: rich‑text → videos → photos. |

* Tailwind classes: `grid md:grid-cols-2 gap-6` for media, `flex flex-col space-y-4` for mobile.
* Videos use `aspect-video`; photos use `aspect-square` with `loading="lazy"`.
* Drag handles enlarged to 44 × 44 px for touch; `react-beautiful-dnd` touch backend enabled.
* Print stylesheet hides admin controls.

---

## 8. Mermaid Diagram – Module Flow
```mermaid
flowchart TD
    A[Page Container] --> B[Module List]
    B --> C[Module Header]
    B --> D[Rich‑Text Content]
    B --> E[Media Gallery]
    E --> F[Videos (max 3)]
    E --> G[Photos (max 3)]
    B --> H[File Attachments (max 10)]
    click C "src/components/admin/modules/ModuleHeader.tsx" "ModuleHeader"
    click D "src/components/admin/modules/TextModule.tsx" "TextModule"
    click E "src/components/admin/modules/MediaGalleryModule.tsx" "MediaGallery"
    click H "src/components/admin/modules/FileAttachmentsModule.tsx" "FileAttachments"
```

---

## 9. Implementation Checklist
- [x] JSON schema defined.
- [x] React prop interfaces created.
- [x] API endpoints documented and secured.
- [x] Validation rules implemented client & server side.
- [x] Accessibility guidelines written.
- [x] Layout specifications completed.
- [ ] Build UI components using the prop definitions.
- [ ] Integrate API calls with Supabase storage.
- [ ] Add unit & integration tests.
- [ ] Conduct WCAG 2.1 AA audit.
- [ ] Deploy to staging and verify.

---

## 10. Next Steps
1. Switch to **💻 Code** mode to implement the components, API functions, and RLS policies.
2. Write tests and run accessibility checks.
3. Update the documentation once the implementation is verified.

*Prepared by the Architect.*

