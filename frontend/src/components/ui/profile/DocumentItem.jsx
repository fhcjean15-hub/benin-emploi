import { Upload, Trash2, FileText } from "lucide-react";

export const DocumentItem = ({ label, fileUrl }) => {
  return (
    <div className="flex items-center justify-between border rounded-xl p-4">
      <div>
        <p className="font-medium">{label}</p>
        {fileUrl ? (
          <a
            href={fileUrl}
            target="_blank"
            className="text-sm text-blue-600 underline"
          >
            Voir le document
          </a>
        ) : (
          <p className="text-sm text-slate-500">Aucun fichier</p>
        )}
      </div>

      <div className="flex gap-2">
        <label className="btn-secondary cursor-pointer">
          <Upload className="w-4 h-4" />
          <input type="file" hidden />
        </label>

        {fileUrl && (
          <button className="btn-danger">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// import { Upload, Trash2, FileText } from "lucide-react";

// export default function DocumentItem({ label, url, onUpload, onDelete }) {
//   return (
//     <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
//       <div className="flex items-center gap-3">
//         <FileText className="w-5 h-5 text-slate-500" />
//         <div>
//           <p className="font-medium text-slate-900">{label}</p>
//           {url ? (
//             <a href={url} target="_blank" className="text-sm text-blue-600 underline">
//               Voir le document
//             </a>
//           ) : (
//             <p className="text-sm text-slate-500">Aucun document</p>
//           )}
//         </div>
//       </div>

//       <div className="flex gap-2">
//         <label className="btn-secondary cursor-pointer">
//           <Upload className="w-4 h-4" />
//           <input type="file" hidden onChange={onUpload} />
//         </label>

//         {url && (
//           <button onClick={onDelete} className="btn-danger">
//             <Trash2 className="w-4 h-4" />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }
