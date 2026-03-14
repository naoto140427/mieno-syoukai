1. **Create `TacticalDropzoneModal.tsx`**:
   - Use `react-dropzone` and `framer-motion`.
   - Implement fullscreen modal with `backdrop-blur-md` and semi-transparent overlay.
   - UI should be Apple-like, clean, modern corporate.
   - **Phase 1 (Idle)**: Big dashed area. When dragging over, background gets a soft cyan/gray tint. Text: "Drop GPX file here to analyze tactical data".
   - **Phase 2 (Analyzing)**: Once dropped, read file -> `parseGPX` -> `getLocationName`. Show dynamic text (e.g. "🛰 Establishing satellite link...", "📍 Extracting trajectory data...").
   - **Phase 3 (Preview & Edit)**: Show extracted data (distance, max speed, max elevation) as clean badges. Add form for Title, Weather, Details.
   - On submit, pass data to `onSave` prop.

2. **Update `Archives.tsx`**:
   - Import `TacticalDropzoneModal`.
   - Add state `isUploadModalOpen` (boolean).
   - If `isAdmin` is true, render a prominent button "+ UPLOAD TACTICAL DATA" near the title.
   - Pass `isOpen`, `onClose`, `onSave` to the modal.
   - `onSave` should call the server action `addArchive` with the formatted data, and handle UI updates (closing modal, reloading if necessary).

3. **Pre-commit Checks**: Run TypeScript checks and verify file structures to ensure proper quality.
