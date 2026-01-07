import { useEffect, useState } from 'react';
import api from '../../service/api_Authorization';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products'); // interceptor agrega el token
        setProducts(data.data); // ProductResource → data.data
      } catch (err) {
        console.error('Error cargando productos', err);

        if (err.response?.status === 401) {
          setError('No autorizado. Inicia sesión nuevamente.');
        } else {
          setError('No se pudo cargar el inventario.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="p-10 text-center">Cargando inventario...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Inventario de Productos</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          + Nuevo Producto
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4 border-b">Nombre</th>
              <th className="px-6 py-4 border-b">Precio</th>
              <th className="px-6 py-4 border-b">Stock Actual</th>
              <th className="px-6 py-4 border-b">Stock Mín.</th>
              <th className="px-6 py-4 border-b">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  ${product.price}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {product.actual_stock}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {product.min_stock}
                </td>
                <td className="px-6 py-4">
                  {product.actual_stock <= product.min_stock ? (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                      Bajo Stock
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Disponible
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
