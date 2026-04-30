import { layout as l } from "@/lib/theme";

export default function LibraryPage() {
 return (
 <div className={l.page}>
 <div className={l.pageHeader}>
 <h1 className={l.pageTitle}>Documents Library</h1>
 <p className={l.pageSubtitle}>View and manage your uploaded documents</p>
 </div>
 </div>
 );
}