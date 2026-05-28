import { useState, useRef } from 'react';
import { uploadService } from '../../services/uploadService';
import { useToast } from './Toast';

/**
 * FileUploadInput — dual-mode file field:
 * 1. Manual URL text input (always works)
 * 2. Upload button → sends to GCS via uploadService
 *
 * Props:
 *   value      - current URL string
 *   onChange   - callback(url: string)
 *   folder     - GCS folder hint ('kontrak' | 'lampiran_tugas' | 'laporan' | 'avatars' | 'misc')
 *   accept     - file accept attr string
 *   resourceId - optional resource id for folder structure
 */
export default function FileUploadInput({
  value = '',
  onChange,
  folder = 'misc',
  accept = '.jpg,.jpeg,.png,.pdf,.docx,.xlsx',
  resourceId = null,
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const toast = useToast();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadService.uploadFile(file, folder, resourceId);
      const url = res.data?.data?.file?.url;
      if (url) {
        onChange(url);
        toast('File berhasil diupload!', 'success');
      } else {
        throw new Error('URL tidak diterima dari server');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Gagal upload file';
      toast(`${msg}. Coba masukkan URL manual atau pastikan GCS sudah dikonfigurasi.`, 'error');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://... atau klik Upload untuk pilih file"
          className="input flex-1 text-xs"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="btn-secondary btn-sm shrink-0 whitespace-nowrap"
        >
          {uploading ? (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 border-2 border-current/40 border-t-current rounded-full animate-spin" />
              Upload...
            </span>
          ) : '📎 Upload'}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Preview link jika sudah ada URL */}
      {value && (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-dark transition-colors"
        >
          📎 Lihat file terlampir
        </a>
      )}
    </div>
  );
}