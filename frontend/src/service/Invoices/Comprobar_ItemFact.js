import { Spli_Delimitador, T_Pro, T_Ser } from "../../Misc/Definitions";

function Comprobar(item) {
  if (item.type == T_Ser) {
    return Compro_Service(item);
  } else if (item.type == T_Pro) {
    return Compro_Producto(item);
  } else {
    return {
      status: "Error",
      message: "Tipo de item desconocido",
    };
  }
}

function Compro_Service(Serv) {
  const cantidadServicio = parseInt(Serv.quantity_ ?? Serv.quantity) || 1;
  const productosFaltantes = [];

  if (Serv.products && Serv.products.length > 0) {
    for (let producto of Serv.products) {
      const productoParaValidar = {
        ...producto,
        quantity_: (parseInt(producto.quantity) || 0) * cantidadServicio,
      };

      const resultado = Compro_Producto(productoParaValidar);

      if (resultado.status !== "OK") {
        productosFaltantes.push({
          nombre: producto.name,
          necesario: productoParaValidar.quantity,
          disponible: parseInt(producto.actual_stock) || 0,
        });
      }
    }
  }

  if (productosFaltantes.length > 0) {
    const mensajeProductos = productosFaltantes
      .map(
        (prod) =>
          `°${prod.nombre} (Necesario: ${prod.necesario * cantidadServicio}, Disponible: ${prod.disponible})`,
      )
      .join(Spli_Delimitador);

    return {
      status: "Error",
      message: `No hay suficiente stock para completar el servicio ${Serv.name}: ${Spli_Delimitador}${mensajeProductos}`,
    };
  }

  return { status: "OK", message: "OK" };
}

function Compro_Producto(Pro) {
  const cantidadDeseada = parseInt(Pro.quantity_ ?? Pro.quantity) || 0;
  const stockDisponible = parseInt(Pro.actual_stock) || 0;

  if (cantidadDeseada <= 0) {
    return {
      status: "Error",
      message: "La cantidad debe ser mayor a 0",
    };
  }

  if (cantidadDeseada > stockDisponible) {
    return {
      status: "Error",
      message: `No hay suficiente stock de ${Pro.name}. Disponible: ${stockDisponible}, Solicitado: ${cantidadDeseada}`,
    };
  }

  return { status: "OK", message: "OK" };
}

export default Comprobar;
