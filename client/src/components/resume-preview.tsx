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
            <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0 gap-0 duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-bottom-12 data-[state=open]:slide-in-from-bottom-12 shadow-2xl border-none ring-1 ring-gray-200/50 [&>button]:hidden">
                <DialogHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0 bg-muted/30 transition-all duration-300 ease-in-out">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:scale-110 transition-transform duration-200">
                            <X className="w-4 h-4" />
                        </Button>
                        <DialogTitle className="animate-fade-in line-clamp-1 text-left">Resume Preview</DialogTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Zoom Toggle (Mobile Only or Always?) Useful for both but critical for mobile */}
                        <Button variant="outline" size="icon" onClick={toggleZoom} className="h-8 w-8 mr-1 md:hidden">
                            {isFitToScreen ? <ZoomIn className="w-4 h-4" /> : <ZoomOut className="w-4 h-4" />}
                        </Button>

                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button variant="outline" size="sm" onClick={() => handlePrint()} className="hover:scale-105 transition-transform duration-200 w-full sm:w-auto justify-start sm:justify-center">
                                <Printer className="w-4 h-4 mr-2" />
                                <span>Print / Save</span>
                            </Button>
                            <Button variant="default" size="sm" onClick={() => handlePrint()} className="hover:scale-105 transition-transform duration-200 w-full sm:w-auto justify-start sm:justify-center">
                                <Download className="w-4 h-4 mr-2" />
                                <span>Download PDF</span>
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-auto bg-gray-100 p-4 md:p-8">
                    {/* Printable Area - Wrapper for scaling if needed */}
                    <div
                        className={`transition-all duration-500 ease-in-out origin-top-left ${isContentVisible ? 'opacity-100' : 'opacity-0'} transform ${isContentVisible ? 'translate-y-0' : 'translate-y-4'}`}
                        style={{
                            transform: `scale(${scale})`,
                            transformOrigin: 'top center', // Center feels better for fit-screen? or top left? Usually Top Left if we want to scroll. But for fit-screen, Top Center looks nice.
                            // If scale < 1, width decreases. We need to ensure parent aligns it?
                            // Let's use 'top left' if we can scroll, or 'top center' if we want it centered.
                            // Let's stick to 'top left' and use margin-auto on parent flexible?
                            width: isFitToScreen ? 'fit-content' : '100%',
                            height: isFitToScreen ? 'fit-content' : 'auto',
                            margin: '0 auto'
                        }}
                    >
                        <div ref={componentRef}>
                            {renderTemplate()}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}