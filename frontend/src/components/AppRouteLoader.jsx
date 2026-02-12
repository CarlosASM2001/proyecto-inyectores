import { LoaderCircle } from "lucide-react";

export default function AppRouteLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white/90 p-8 text-center shadow-xl shadow-slate-200/40 backdrop-blur">
        <LoaderCircle className="h-10 w-10 animate-spin text-workshop-red" />
        <div>
          <p className="text-sm font-black uppercase tracking-[0.24em] text-slate-400">
            Cargando modulo
          </p>
          <h2 className="mt-1 text-lg font-black text-slate-900">
            Preparando una experiencia mas rapida
          </h2>
        </div>
      </div>
    </div>
  );
}
