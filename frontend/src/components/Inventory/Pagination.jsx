import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  lastPage,
  total,
  onPageChange,
}) {
  if (lastPage <= 1) return null;

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-2xl shadow-sm mt-6">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">
            Mostrando un total de{" "}
            <span className="font-bold text-gray-900">{total}</span> resultados
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-gray-700 uppercase tracking-widest">
            Página {currentPage} de {lastPage}
          </span>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Anterior</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === lastPage}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Siguiente</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>

      {/* Vista Móvil simplificada */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm font-bold text-gray-700 self-center">
          {currentPage} / {lastPage}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
