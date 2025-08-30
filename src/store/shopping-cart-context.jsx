import { createContext } from "react";
import { useState, useReducer } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";

// creates an object with the context component
export const CartContext = createContext({
  items: [],
  // the functions are here just for autocompletion
  addItemToCart: () => {},
  updateItemQuantity: () => {},
});

//does not need to be recreated when cartContextprovider gets rendered, does not need access to props or anything like that
//takes two paramaters
// needs to be connected to the useReducer hook, pass it as an argument

function shoppingCartReducer(state, action) {
  // this updates the state
  // id becomes the payload
  if (action.type === "ADD_ITEM") {
    const updatedItems = [...state.items];

    const existingCartItemIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id === action.payload
    );
    const existingCartItem = updatedItems[existingCartItemIndex];

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      const product = DUMMY_PRODUCTS.find(
        (product) => product.id === action.payload
      );
      updatedItems.push({
        id: action.payload,
        name: product.title,
        price: product.price,
        quantity: 1,
      });
    }

    return {
      ...state, // needed in more complex states to not lose the data
      items: updatedItems,
    };
  }
  if (action.type === "UPDATE_ITEM") {
    const updatedItems = [...state.items];
    const updatedItemIndex = updatedItems.findIndex(
      (item) => item.id === action.productId
    );

    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    };

    updatedItem.quantity += action.amount;

    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1);
    } else {
      updatedItems[updatedItemIndex] = updatedItem;
    }

    return {
      items: updatedItems,
    };
  }
  return state;
}

// moved all the logic in the cartcontext provider
// return CartContext.Provider  with children
// wrap the APP with  CartContextProvider created here

export default function CartContextProvider({ children }) {
  //can use cartState instead of shoppingCart useState
  // items can be set as an initial state in the reduducer
  const [cartState, shoppingCartDispatch] = useReducer(shoppingCartReducer, {
    items: [],
  });


   // useState not needed anymore since we are managing the state with useReducer
//   const [shoppingCart, setShoppingCart] = useState({
//     items: [],
//   });

  function handleAddItemToCart(id) {
    // use this to dispatch an action
    // the id parapeter is set as an payload on the action object
    shoppingCartDispatch({
      type: "ADD_ITEM",
      payload: id,
    });

    // THIS LOGIC WAS MOVED TO THE REDUCER FUNCTION

    //     setShoppingCart((prevShoppingCart) => {
    //       const updatedItems = [...prevShoppingCart.items];

    //       const existingCartItemIndex = updatedItems.findIndex(
    //         (cartItem) => cartItem.id === id
    //       );
    //       const existingCartItem = updatedItems[existingCartItemIndex];

    //       if (existingCartItem) {
    //         const updatedItem = {
    //           ...existingCartItem,
    //           quantity: existingCartItem.quantity + 1,
    //         };
    //         updatedItems[existingCartItemIndex] = updatedItem;
    //       } else {
    //         const product = DUMMY_PRODUCTS.find((product) => product.id === id);
    //         updatedItems.push({
    //           id: id,
    //           name: product.title,
    //           price: product.price,
    //           quantity: 1,
    //         });
    //       }

    //       return {
    //         items: updatedItems,
    //       };
    //     });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    shoppingCartDispatch({
      type: "UPDATED_ITEM",
      payload: { productId: productId, amount: amount },
    });
    // THIS LOGIC WAS MOVED TO THE REDUCER FUNCTION

    // setShoppingCart((prevShoppingCart) => {
    //   const updatedItems = [...prevShoppingCart.items];
    //   const updatedItemIndex = updatedItems.findIndex(
    //     (item) => item.id === productId
    //   );

    //   const updatedItem = {
    //     ...updatedItems[updatedItemIndex],
    //   };

    //   updatedItem.quantity += amount;

    //   if (updatedItem.quantity <= 0) {
    //     updatedItems.splice(updatedItemIndex, 1);
    //   } else {
    //     updatedItems[updatedItemIndex] = updatedItem;
    //   }

    //   return {
    //     items: updatedItems,
    //   };
    // });
  }
  // create the context value from the state value
  // any component that can read this context can call addItemToCart to access handleAddItemToCart that adds an item
  // or any other functions added to it
  const contextValue = {
    items: cartState.items,
    addItemToCart: handleAddItemToCart,
    updateItemQuantity: handleUpdateCartItemQuantity,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}




// counter update example

// import React from 'react'


// export function counterReducer(state,action) {
//     if(action.type === "INCREMENT") {
//         return {count : state.count + 1}
//     }
    
//     else if(action.type === "DECREMENT") {
//         return {count : state.count - 1}
//     }
    
//    else if(action.type === "RESET") {
//         return {count : 0}
//     }
//     return state
// }



// function App() {
    
//     const[counterState, dispatchCounter] = React.useReducer(counterReducer, {
//         count: 0})
    
    
//   return (
//     <div id="app">
//       <h1>The (Final?) Counter</h1>
//       <p id="actions">
//         <button onClick={()=> dispatchCounter ({type: "INCREMENT"})}>Increment</button>
//         <button onClick={()=> dispatchCounter ({type: "DECREMENT"})}>Decrement</button>
//         <button onClick={()=> dispatchCounter ({type: "RESET"})}>Reset</button>
//       </p>
//       <p id="counter">{counterState.count}</p>
//     </div>
//   );
// }

// export default App;
