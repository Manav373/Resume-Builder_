
import './swipe-card.css';
import { ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';


interface SwipeCardProps {
    className?: string;
    title?: string;
    description?: string;
    href?: string;
    onClick?: (e: React.MouseEvent) => void;
    action?: React.ReactNode;
}

export function SwipeCard({
    className,
    title = "New Resume",
    description = "Start from scratch",
    href = "/dashboard/resumes/new",
    onClick,
    action
}: SwipeCardProps) {
    const Content = (
        <div className={cn("swipe-card-container group", className)} onClick={onClick}>
            <div className="swipe-card-left">
                <div className="swipe-card-doc">
                    <div className="swipe-card-doc-header" />
                    <div className="swipe-card-doc-line" />
                    <div className="swipe-card-doc-line" style={{ width: '80%' }} />
                    <div className="swipe-card-doc-line" style={{ width: '90%' }} />
                    <div className="swipe-card-doc-line" style={{ width: '60%' }} />
                </div>
                <div className="swipe-card-slot">
                    <Check className="swipe-card-check w-5 h-5" />
                </div>
            </div>
            <div className="swipe-card-right">
                <div className="swipe-card-label text-left">
                    <span>{title}</span>
                    <span className="swipe-card-sublabel">{description}</span>
                </div>
                {action ? action : <ArrowRight className="swipe-card-arrow" />}
            </div>
        </div>
    );

    if (href) {
        return <Link to={href} className="block h-full">{Content}</Link>;
    }

    return Content;
}
