"use client";

import { UploadCloud, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { layout as l, upload as u } from "@/lib/theme";

export default function UploadPage() {
 return (
 <div className={l.page}>
 <div className={l.pageHeader}>
 <h1 className={l.pageTitle}>Upload Documents</h1>
 <p className={l.pageSubtitle}>
 Upload a document for AI review or send it to a reviewer
 </p>
 </div>

 <div className="max-w-4xl">
 <div className={u.dropzone}>
 <div className="flex flex-col items-center justify-center text-center">
 <UploadCloud className={u.icon} />
 <p className={u.text}>Drop your document here or click browse below</p>

 <div className={u.btnRow}>
 <Button variant="mybutton" className="px-6 py-2">
 <Paperclip className="h-4 w-4 mr-2" />
 Browse file
 </Button>
 <Button variant="mycancel" className="px-6 py-2">PDF</Button>
 <Button variant="mycancel" className="px-6 py-2">DOCX</Button>
 <Button variant="mycancel" className="px-6 py-2">TXT</Button>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}