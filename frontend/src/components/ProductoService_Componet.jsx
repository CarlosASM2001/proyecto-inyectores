import { useState } from "react";

function ProductoService_Componet({
  Producto,
  BorrarProducto,
  Producto_UpdaCant,
}) {
  const [TextCantidad, setTextCantidad] = useState(Producto.quantity || 1);

  const handleCantidadChange = (e) => {
    const nuevaCantidad = e.target.valueAsNumber;
    setTextCantidad(nuevaCantidad);
    Producto_UpdaCant(Producto, nuevaCantidad);
  };

  return (
    <>
      {Producto.name}{" "}
      <input
        type="number"
        value={TextCantidad}
        onChange={handleCantidadChange}
        required
        min="1"
      />
      <button onClick={() => BorrarProducto(Producto)}>Borrar</button>
    </>
  );
}

export default ProductoService_Componet;
