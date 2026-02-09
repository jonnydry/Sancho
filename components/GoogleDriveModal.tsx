import React, { useState, useEffect, useCallback } from "react";
import { JournalStorage } from "../services/journalStorage";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
}

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryTitle: string;
  entryId: string | null;
  onExportComplete: (result: { success: boolean; message: string; link?: string }) => void;
  onImportComplete: (content: string, title: string) => void;
}

type Tab = "export" | "import";

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  entryTitle,
  entryId,
  onExportComplete,
  onImportComplete,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("export");
  const [isExporting, setIsExporting] = useState(false);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [importingFileId, setImportingFileId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filesLoaded, setFilesLoaded] = useState(false);

  const loadFiles = useCallback(async (pageToken?: string) => {
    setIsLoadingFiles(true);
    setError(null);
    try {
      const result = await JournalStorage.listDriveFiles(pageToken);
      if (pageToken) {
        setFiles(prev => [...prev, ...result.files]);
      } else {
        setFiles(result.files);
      }
      setNextPageToken(result.nextPageToken);
      setFilesLoaded(true);
    } catch (err: any) {
      setError(err.message || "Failed to load files from Google Drive");
    } finally {
      setIsLoadingFiles(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && activeTab === "import" && !filesLoaded) {
      loadFiles();
    }
  }, [isOpen, activeTab, filesLoaded, loadFiles]);

  useEffect(() => {
    if (!isOpen) {
      setFilesLoaded(false);
      setFiles([]);
      setNextPageToken(undefined);
      setError(null);
      setActiveTab("export");
    }
  }, [isOpen]);

  const handleExport = async () => {
    if (!entryId || isExporting) return;
    setIsExporting(true);
    setError(null);

    try {
      const result = await JournalStorage.exportToGoogleDrive(entryId);
      if (result.success) {
        onExportComplete({
          success: true,
          message: `Exported "${result.fileName}" to Google Drive`,
          link: result.webViewLink,
        });
      } else {
        onExportComplete({
          success: false,
          message: result.error || "Failed to export to Google Drive",
        });
      }
      onClose();
    } catch {
      onExportComplete({
        success: false,
        message: "Failed to export to Google Drive",
      });
      onClose();
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (file: DriveFile) => {
    if (importingFileId) return;
    setImportingFileId(file.id);
    setError(null);

    try {
      const result = await JournalStorage.importFromDrive(file.id);
      const cleanName = file.name.replace(/\.(md|txt|text)$/i, "");
      onImportComplete(result.content, cleanName);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to import file");
    } finally {
      setImportingFileId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatSize = (sizeStr?: string) => {
    if (!sizeStr) return "";
    const bytes = parseInt(sizeStr, 10);
    if (isNaN(bytes)) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType === "application/vnd.google-apps.document") {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      );
    }
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    );
  };

  if (!isOpen) return null;

  const sanitizedTitle = (entryTitle || "Untitled Note").substring(0, 100);
  const exportFileName = `${sanitizedTitle.replace(/[<>:"/\\|?*]/g, "_")}.md`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-bg border border-default rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-default">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            <h3 className="text-lg font-semibold text-default">Google Drive</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted hover:text-default hover:bg-default/10 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="flex border-b border-default">
          <button
            onClick={() => setActiveTab("export")}
            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "export"
                ? "text-accent border-b-2 border-accent"
                : "text-muted hover:text-default"
            }`}
          >
            Export to Drive
          </button>
          <button
            onClick={() => setActiveTab("import")}
            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "import"
                ? "text-accent border-b-2 border-accent"
                : "text-muted hover:text-default"
            }`}
          >
            Import from Drive
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "export" ? (
            <div className="p-5 space-y-4">
              <p className="text-sm text-muted">
                Export this journal entry as a Markdown file to your Google Drive.
              </p>

              <div className="bg-bg-alt rounded-lg p-4 space-y-3 border border-default/30">
                <div className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted mt-0.5 shrink-0">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <div className="min-w-0">
                    <p className="text-xs text-muted font-medium uppercase tracking-wide">File name</p>
                    <p className="text-sm text-default truncate">{exportFileName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted mt-0.5 shrink-0">
                    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
                  </svg>
                  <div>
                    <p className="text-xs text-muted font-medium uppercase tracking-wide">Save location</p>
                    <p className="text-sm text-default">My Drive (root folder)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted mt-0.5 shrink-0">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                  <div>
                    <p className="text-xs text-muted font-medium uppercase tracking-wide">Format</p>
                    <p className="text-sm text-default">Markdown (.md) with title, date, and tags</p>
                  </div>
                </div>
              </div>

              {!entryId && (
                <p className="text-sm text-amber-500">No entry selected to export.</p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-bg-alt text-default border border-default hover:bg-bg-alt/80 hover:shadow-sm transition-all duration-200 interactive-base interactive-scale"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExport}
                  disabled={isExporting || !entryId}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md transition-all duration-200 interactive-base interactive-scale disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isExporting ? (
                    <>
                      <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      Export to Drive
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 space-y-3">
              <p className="text-sm text-muted">
                Select a text or document file from your Google Drive to import as a new journal entry.
              </p>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 text-sm rounded-lg p-3">
                  {error}
                </div>
              )}

              {isLoadingFiles && files.length === 0 ? (
                <div className="py-8 flex flex-col items-center gap-3 text-muted">
                  <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  <span className="text-sm">Loading files from Google Drive...</span>
                </div>
              ) : files.length === 0 && filesLoaded ? (
                <div className="py-8 text-center text-muted text-sm">
                  No text or document files found in your Google Drive.
                </div>
              ) : (
                <div className="space-y-1">
                  {files.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => handleImport(file)}
                      disabled={importingFileId !== null}
                      className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-bg-alt border border-transparent hover:border-default/30 transition-all duration-150 disabled:opacity-50 group"
                    >
                      <div className="shrink-0">
                        {importingFileId === file.id ? (
                          <svg className="animate-spin text-accent" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                          </svg>
                        ) : (
                          getFileIcon(file.mimeType)
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-default truncate group-hover:text-accent transition-colors">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted">
                          {formatDate(file.modifiedTime)}
                          {file.size && ` · ${formatSize(file.size)}`}
                        </p>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </button>
                  ))}

                  {nextPageToken && (
                    <button
                      onClick={() => loadFiles(nextPageToken)}
                      disabled={isLoadingFiles}
                      className="w-full py-2.5 text-sm text-accent hover:text-accent-hover font-medium rounded-lg hover:bg-bg-alt transition-colors disabled:opacity-50"
                    >
                      {isLoadingFiles ? "Loading more..." : "Load more files"}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
