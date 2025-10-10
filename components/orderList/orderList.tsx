import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";

type OrderItem = {
  product_id: number;
  name: string;
  quantity: number;
  total: string;
};

type Order = {
  id: number;
  date_created: string;
  status: string;
  total: string;
  line_items: OrderItem[] | any; // API might return unexpected type
};

const OrdersList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/orders/orders?userId=${user.id}`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading)
    return (
      <p className="text-center py-4 text-gray-600">Loading orders...</p>
    );
  if (orders.length === 0)
    return <p className="text-center py-4 text-gray-600">No orders found.</p>;

  return (
    <div className="max-h-[600px] overflow-y-auto space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="border rounded shadow-sm bg-white p-4 flex flex-col"
        >
          <div className="flex justify-between mb-2">
            <div>
              <p className="font-medium">Order #{order.id}</p>
              <p className="text-sm text-gray-500">
                Date: {new Date(order.date_created).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">Status: {order.status}</p>
            </div>
            <div className="font-semibold">${order.total}</div>
          </div>

          <div className="mt-2">
            <h4 className="font-semibold mb-1 text-gray-700">Products</h4>
            <ul className="max-h-40 overflow-y-auto border-t border-gray-200 pt-2 space-y-1 text-sm text-gray-600">
              {(Array.isArray(order.line_items) ? order.line_items : []).map(
                (item) => (
                  <li
                    key={item.product_id}
                    className="flex justify-between items-center"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">${item.total}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersList;
