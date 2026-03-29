import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';

const ReceiptUploader = ({ onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('receipt', selectedFile);

    try {
      const response = await api.post('/utils/parse-ocr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        onUploadSuccess(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OCR parsing failed. You can still enter details manually.');
    } finally {
      setLoading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const removeFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer h-[200px] ${
            isDragActive ? 'border-primary-500 bg-primary-500/10' : 'border-slate-700 hover:border-slate-500 bg-slate-800/50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700">
            <Upload className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-sm text-slate-300 font-medium">
            {isDragActive ? 'Drop receipt here' : 'Click to upload or drag receipt'}
          </p>
          <p className="text-xs text-slate-500 mt-2">Supports JPG, PNG (Max 5MB)</p>
        </div>
      ) : (
        <div className="card border-slate-700 bg-slate-800/80 p-6 flex items-center justify-between animate-in zoom-in duration-200">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-white max-w-[200px] truncate">{file.name}</p>
              <div className="flex items-center gap-2">
                {loading ? (
                  <div className="flex items-center gap-1.5 text-[10px] text-primary-400 font-bold uppercase tracking-widest">
                    <Loader2 className="w-3 h-3 animate-spin" /> Analyzing...
                  </div>
                ) : error ? (
                  <div className="flex items-center gap-1.5 text-[10px] text-red-500 font-bold uppercase tracking-widest">
                    <AlertCircle className="w-3 h-3" /> Error
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[10px] text-green-500 font-bold uppercase tracking-widest">
                    <CheckCircle className="w-3 h-3" /> Scanned
                  </div>
                )
              }
              </div>
            </div>
          </div>
          <button onClick={removeFile} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="text-xs text-red-500 italic px-2">
          {error}
        </div>
      )}

      {!loading && !error && file && (
        <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-3 flex items-center gap-3">
          <div className="w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-3.5 h-3.5 text-primary-500" />
          </div>
          <p className="text-[10px] text-primary-400 font-bold uppercase tracking-wider">
            OCR SUCCESS: Form has been pre-filled for your review.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReceiptUploader;
