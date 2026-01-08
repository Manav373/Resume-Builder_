import ResumeForm from "@/components/resume-form";

export default function CreateResumePage() {
    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">Create New Resume</h1>
            <ResumeForm />
        </div>
    )
}
