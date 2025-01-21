import Pizza from "../Pizza";
import Cart from "../Cart";

import { CartContext } from "../contexts";
import { useEffect, useState, useContext } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const Route = createLazyFileRoute("/order")({
  component: Order,
})

function Order() {
  const [pizzaTypes, setPizzaTypes] = useState([]);
  const [pizzaType, setPizzaType] = useState("pepperoni");
  const [pizzaSize, setPizzaSize] = useState("M");
  const [cart, setCart] = useContext(CartContext);
  const [loading, setLoading] = useState(true);

  async function checkout() {
    setLoading(true);

    await fetch("/api/order", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart })
    });

    setCart([]);
    setLoading(false);
  }

  let price, selectedPizza;

  async function fetchPizzaTypes() {
    const pizzasRes = await fetch("/api/pizzas");
    const pizzasJson = await pizzasRes.json();
    setPizzaTypes(pizzasJson);
    setLoading(false);
  }

  if (!loading) {
    selectedPizza = pizzaTypes.find((pizza) => pizzaType === pizza.id);
    price = intl.format(selectedPizza.sizes[pizzaSize]);
  }



  useEffect(() => {
    fetchPizzaTypes()
  }, [])

  function addToCart() {
    setCart([...cart, { type: pizzaType, size: pizzaSize, price: price }]);
  }

  return (
    <div className="order-page">
      <div className="order">
        <h2>Create Order</h2>
        <form action={addToCart}>
          <div>
            <div>
              <label htmlFor="pizza-type">Pizza Type</label>
              <select
                onChange={(e) => { setPizzaType(e.target.value) }}
                name="pizza-type" value={pizzaType}>
                {pizzaTypes.map((pizza) => (
                  <option key={pizza.id} value={pizza.id}>{pizza.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pizza-size">Pizza Size</label>
              <div>
                <span>
                  <input
                    checked={pizzaSize === "S"}
                    type="radio"
                    name="pizza-size"
                    value="S"
                    id="pizza-s"
                    onChange={(e) => { setPizzaSize(e.target.value) }}
                  />
                  <label htmlFor="pizza-s">Small</label>
                </span>
                <span>
                  <input
                    checked={pizzaSize === "M"}
                    type="radio"
                    name="pizza-size"
                    value="M"
                    id="pizza-m"
                    onChange={(e) => { setPizzaSize(e.target.value) }}
                  />
                  <label htmlFor="pizza-m">Medium</label>
                </span>
                <span>
                  <input
                    checked={pizzaSize === "L"}
                    type="radio"
                    name="pizza-size"
                    value="L"
                    id="pizza-l"
                    onChange={(e) => { setPizzaSize(e.target.value) }}
                  />
                  <label htmlFor="pizza-l">Large</label>
                </span>
              </div>
            </div>
            <button type="submit">Add to Cart</button>
          </div>
          <div className="order-pizza">
            {loading ? <p>Loading Pizza...</p> :
              (<Pizza
                name={selectedPizza.name}
                description={selectedPizza.description}
                image={selectedPizza.image}
              />)
            }
            <p>{price}</p>
          </div>
        </form>
      </div>
      {loading ? <h2>LOADING...</h2> : <Cart checkout={checkout} cart={cart} />}
    </div>
  );
}