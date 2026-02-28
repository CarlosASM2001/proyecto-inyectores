import { useState, useEffect } from "react";
import { Minus, Plus, Check } from "lucide-react";

export default function StockControl({ product, onUpdateStock }) {
  const [localStock, setLocalStock] = useState(product.actual_stock);
  const [isUpdating, setIsUpdating] = useState(false);

  // Sincronizar si el prop cambia externamente
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalStock(product.actual_stock);
  }, [product.actual_stock]);

  const hasChanged = localStock !== product.actual_stock;

  const handleSave = async () => {
    setIsUpdating(true);
    await onUpdateStock(product, localStock);
    setIsUpdating(false);
  };

  const Save_Enter = (event) => {
    if (event.key === "Enter" && hasChanged && !isUpdating) {
      handleSave();
    }
  };

  return (
    <div className="block items-center gap-2 mt-3 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
      <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden flex-1">
        <button
          onClick={() => setLocalStock((prev) => Math.max(0, prev - 1))}
          className="px-3 py-2 text-gray-500 hover:bg-gray-100 hover:text-workshop-red transition-colors"
        >
          <Minus size={16} />
        </button>
        <input
          type="number"
          value={localStock}
          onChange={(e) => setLocalStock(parseInt(e.target.value) || 0)}
          className="w-full text-center font-black text-gray-900 border-x border-gray-100 py-1 outline-none focus:bg-red-50 focus:text-workshop-red transition-colors"
          min="0"
          onFocus={(e) => e.currentTarget.select()}
          onKeyDown={(e) => {
            Save_Enter(e);
          }}
        />
        <button
          onClick={() => setLocalStock((prev) => prev + 1)}
          className="px-3 py-2 text-gray-500 hover:bg-gray-100 hover:text-green-600 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {hasChanged && (
        <div className="mt-2 mr-3 ml-3">
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="p-2 m-0.5 bg-workshop-dark text-white rounded-lg hover:bg-workshop-red transition-all shadow-md shrink-0 disabled:opacity-50 w-full"
            title="Guardar nuevo stock"
          >
            {isUpdating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin m-auto" />
            ) : (
              <Check className="m-auto" size={16} />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
