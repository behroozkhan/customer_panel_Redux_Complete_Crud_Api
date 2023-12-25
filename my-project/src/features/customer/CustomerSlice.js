import { createSlice, nanoid, createEntityAdapter } from "@reduxjs/toolkit";

// initial state for hamara design kis tarah hoga store ka
const initialState = {
  CustomerTodos: JSON.parse(localStorage.getItem("CustomerTodos")) || [],
  // { id: 1, text: "Hello World" }
};

const todosAdapter = createEntityAdapter();

export const TodoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTodo: (state, action) => {
      const { first_name, email, avatar } = action.payload;
      const todo = {
        id: nanoid(),
        first_name,
        email,
        avatar,
      };
      state.CustomerTodos.push(todo);
      localStorage.setItem(
        "CustomerTodos",
        JSON.stringify(state.CustomerTodos)
      );
    },

    removeTodo: (state, action) => {
      state.CustomerTodos = state.CustomerTodos.filter(
        (todo) => todo.id !== action.payload
      );
      localStorage.setItem(
        "CustomerTodos",
        JSON.stringify(state.CustomerTodos)
      );
    },

    editTodo: (state, action) => {
        const { id, first_name, email, avatar } = action.payload;
        
        const index = state.CustomerTodos.findIndex(customer => customer.id === id);
        
        if (index !== -1) {
          const updatedCustomer = {
            ...state.CustomerTodos[index],
            first_name,
            email,
            avatar,
          };
          
          const updatedCustomerTodos = [
            ...state.CustomerTodos.slice(0, index),
            updatedCustomer,
            ...state.CustomerTodos.slice(index + 1),
          ];
          
          state.CustomerTodos = updatedCustomerTodos;
          localStorage.setItem("CustomerTodos", JSON.stringify(updatedCustomerTodos));
        }
      },
      
  },
});

export const { addTodo, removeTodo, editTodo } = TodoSlice.actions;

export default TodoSlice.reducer;
