import { CartContext } from "../store/shopping-cart-context";
import { useContext } from "react";

export default function Product({ id, image, title, price, description }) {
  // connect this component to the context and get ahold of the cartContex value, use the addItemToCart function as the value
  // that was made in App / or shopping cart context
  const { addItemToCart } = useContext(CartContext);

  return (
    <article className="product">
      <img src={image} alt={title} />
      <div className="product-content">
        <div>
          <h3>{title}</h3>
          <p className="product-price">${price}</p>
          <p>{description}</p>
        </div>
        <p className="product-actions">
          <button onClick={() => addItemToCart(id)}>Add to Cart</button>
        </p>
      </div>
    </article>
  );
}
