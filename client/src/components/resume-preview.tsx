import { useRef, useState, useEffect } from 'react';
import type { ResumeData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download, Printer, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ModernSidebar } from './templates/ModernSidebar';
import { Classic } from './templates/Classic';
import { Minimalist } from './templates/Minimalist';
import { Creative } from './templates/Creative';
import { Tech } from './templates/Tech';
import { Ivy } from './templates/Ivy';
import { Silicon } from './templates/Silicon';
import { Executive } from './templates/Executive';

interface ResumePreviewProps {
    open: boolean;
    onClose: () => void;
    data: ResumeData | null;
}

export function ResumePreview({ open, onClose, data }: ResumePreviewProps) {
    const componentRef = useRef<HTMLDivElement>(null);
    const [isContentVisible, setIsContentVisible] = useState(false);
    const [scale, setScale] = useState(1);
    const [isFitToScreen, setIsFitToScreen] = useState(false);

    // Handle initial mobile scaling
    useEffect(() => {
        if (open) {
            const checkMobile = () => {
                // Default to 100% zoom (readable) on open, user can toggle to fit screen
                setIsFitToScreen(false);
                setScale(1);
            };

            // Delay to allow dialog to mount
            const timer = setTimeout(() => {
                setIsContentVisible(true);
                checkMobile();
            }, 200);

            return () => clearTimeout(timer);
        } else {
            setIsContentVisible(false);
        }
    }, [open]);

    const toggleZoom = () => {
        if (isFitToScreen) {
            // Switch to 100%
            setIsFitToScreen(false);
            setScale(1);
        } else {
            // Switch to Fit Screen
            setIsFitToScreen(true);
            const availableWidth = window.innerWidth - 32;
            const scaleFactor = availableWidth / 800;
            setScale(Math.min(scaleFactor, 1));
        }
    };

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: data?.personalInfo?.fullName ? `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume` : 'Resume',
    });

    const renderTemplate = () => {
        if (!data) return null;
        switch (data.templateId) {
            case 'executive':
                return <Executive data={data} />;
            case 'silicon':
                return <Silicon data={data} />;
            case 'ivy':
                return <Ivy data={data} />;
            case 'tech':
                return <Tech data={data} />;
            case 'creative':
                return <Creative data={data} />;
            case 'minimalist':
                return <Minimalist data={data} />;
            case 'classic':
                return <Classic data={data} />;
            case 'modern-sidebar':
            default:
                return <ModernSidebar data={data} />;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0 duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-bottom-12 data-[state=open]:slide-in-from-bottom-12 shadow-2xl border-none ring-1 ring-gray-200/50 [&>button]:hidden">
                <DialogHeader className="p-3 md:p-4 border-b flex flex-row items-center justify-between space-y-0 bg-muted/30 shrink-0">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:scale-110 transition-transform duration-200 shrink-0">
                            <X className="w-5 h-5" />
                        </Button>
                        <DialogTitle className="truncate font-semibold text-sm md:text-lg">Resume Preview</DialogTitle>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2 shrink-0">
                        {/* Mobile Zoom Toggle */}
                        <Button variant="outline" size="icon" onClick={toggleZoom} className="h-8 w-8 md:hidden shrink-0">
                            {isFitToScreen ? <ZoomIn className="w-4 h-4" /> : <ZoomOut className="w-4 h-4" />}
                        </Button>

                        <div className="flex items-center gap-1 sm:gap-2">
                            {/* Desktop buttons often hidden on very small screens if we don't have space? No, download is critical. */}
                            {/* Icon only on mobile */}
                            <Button variant="outline" size="sm" onClick={() => handlePrint()} className="hidden sm:flex hover:scale-105 transition-transform duration-200">
                                <Printer className="w-4 h-4 mr-2" />
                                <span>Print</span>
                            </Button>
                            <Button variant="default" size="sm" onClick={() => handlePrint()} className="hover:scale-105 transition-transform duration-200 px-3">
                                <Download className="w-4 h-4 sm:mr-2" />
                                <span className="hidden sm:inline">Download PDF</span>
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-auto bg-gray-100/50 p-4 md:p-8 relative">
                    {/* Floating Zoom Controls for Desktop */}
                    <div className="hidden md:flex absolute bottom-6 right-8 gap-2 bg-white/90 backdrop-blur border shadow-lg p-1.5 rounded-full z-10 transition-opacity hover:opacity-100 opacity-50">
                        <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="h-8 w-8 rounded-full">
                            <ZoomOut className="w-4 h-4" />
                        </Button>
                        <span className="text-xs font-mono w-12 text-center flex items-center justify-center">{Math.round(scale * 100)}%</span>
                        <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.min(2, s + 0.1))} className="h-8 w-8 rounded-full">
                            <ZoomIn className="w-4 h-4" />
                        </Button>
                        <div className="w-px h-4 bg-border my-auto mx-1" />
                        <Button variant="ghost" size="sm" onClick={toggleZoom} className="h-8 px-3 rounded-full text-xs">
                            {isFitToScreen ? "100%" : "Fit"}
                        </Button>
                    </div>

                    <div
                        className={`transition-all duration-300 ease-out origin-top-center shadow-2xl mx-auto ${isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        style={{
                            transform: `scale(${scale})`,
                            width: isFitToScreen ? 'fit-content' : '100%',
                            maxWidth: isFitToScreen ? '100%' : '210mm',
                        }}
                    >
                        <div ref={componentRef} className="bg-white min-h-[297mm]">
                            {renderTemplate()}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}