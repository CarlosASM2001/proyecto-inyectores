import { useState } from "react";

function ProductoService_Componet({
  Producto,
  BorrarProducto,
  Producto_UpdaCant,
}) {
  const [TextCantidad, setTextCantidad] = useState(1);

  return (
    <>
      {Producto.name}{" "}
      <input
        type="number"
        value={TextCantidad}
        onChange={(e) => {
          setTextCantidad(e.target.value);
          Producto_UpdaCant(Producto, e.target.valueAsNumber);
        }}
        required
      />
      <button onClick={() => BorrarProducto(Producto)}>Borrar</button>
    </>
  );
}

export default ProductoService_Componet;
