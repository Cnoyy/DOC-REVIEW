import { layout as l } from "@/lib/theme";

export default function ReviewerPage() {
 return (
 <div className={l.page}>
 <div className={l.pageHeader}>
 <h1 className={l.pageTitle}>Review Documents</h1>
 <p className={l.pageSubtitle}>View documents assigned for review</p>
 </div>
 </div>
 );
}