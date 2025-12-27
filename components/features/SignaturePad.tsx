'use client';

import React, { useRef, useState, useEffect } from 'react';
import { X, Eraser, Check, PenTool, Upload } from 'lucide-react';

interface SignaturePadProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (dataUrl: string) => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ isOpen, onClose, onSave }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);
    const [activeTab, setActiveTab] = useState<'draw' | 'upload'>('draw');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && activeTab === 'draw' && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Set canvas size to match display size
                const rect = canvas.getBoundingClientRect();
                canvas.width = rect.width;
                canvas.height = rect.height;

                // Pen style
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.strokeStyle = '#000000';
            }
        }
    }, [isOpen, activeTab]);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        if (activeTab !== 'draw') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        setHasSignature(true);

        const { offsetX, offsetY } = getCoordinates(e, canvas);
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || activeTab !== 'draw') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { offsetX, offsetY } = getCoordinates(e, canvas);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        const rect = canvas.getBoundingClientRect();
        return {
            offsetX: clientX - rect.left,
            offsetY: clientY - rect.top
        };
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (activeTab === 'upload' && uploadedImage) {
            onSave(uploadedImage);
            onClose();
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) {
            onClose();
            return;
        }
        // Save as transparent PNG
        const dataUrl = canvas.toDataURL('image/png');
        onSave(dataUrl);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                        <PenTool className="w-5 h-5 text-blue-600" />
                        Add Signature
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100">
                    <button
                        onClick={() => setActiveTab('draw')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'draw' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                    >
                        Draw
                    </button>
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'upload' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                    >
                        Upload Image
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-4 bg-white relative min-h-[300px] flex flex-col justify-center">
                    {activeTab === 'draw' ? (
                        <>
                            <div className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 relative overflow-hidden touch-none flex-1">
                                <canvas
                                    ref={canvasRef}
                                    className="w-full h-full block cursor-crosshair touch-none absolute inset-0"
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                    onTouchStart={startDrawing}
                                    onTouchMove={draw}
                                    onTouchEnd={stopDrawing}
                                />
                                {!hasSignature && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 font-medium select-none">
                                        Sign here
                                    </div>
                                )}
                            </div>
                            <div className="text-center mt-2 text-xs text-slate-400">
                                Using mouse or touch screen
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                            {uploadedImage ? (
                                <div className="relative w-full h-48 border border-slate-200 rounded-lg overflow-hidden bg-slate-50 group">
                                    <img src={uploadedImage} alt="Uploaded Signature" className="w-full h-full object-contain" />
                                    <button
                                        onClick={() => setUploadedImage(null)}
                                        className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-48 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-colors gap-3"
                                >
                                    <div className="bg-slate-100 p-3 rounded-full">
                                        <Upload className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-slate-700 font-medium font-sm">Click to upload image</p>
                                        <p className="text-slate-400 text-xs">PNG, JPG (Transparent recommended)</p>
                                    </div>

                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-slate-100 flex gap-3">
                    {activeTab === 'draw' && (
                        <button
                            onClick={clearCanvas}
                            className="flex-1 py-2.5 text-slate-600 font-bold text-sm bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center justify-center gap-2"
                        >
                            <Eraser className="w-4 h-4" /> Clear
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={activeTab === 'upload' && !uploadedImage}
                        className="flex-[2] py-2.5 text-white font-bold text-sm bg-slate-900 hover:bg-slate-800 rounded-xl transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Check className="w-4 h-4" /> Use Signature
                    </button>
                </div>

            </div>
        </div>
    );
};
