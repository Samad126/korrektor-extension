import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { checkForMistakes } from "./messageSlice";

const initialState = {
  socket: null,
  correctedMessage: "",
};


export const socketInitializer = createAsyncThunk(
  "websocket/connect",
  async ({ data, key }, { dispatch, getState }) => {
    try {
      const socket = new WebSocket(`wss://api.korrektor.az/ws/ai/?key=${key}`);

      socket.onopen = () => {
        if (data) {
          socket.send(data);
        }
      };

      socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        console.log(msg);

        const sanitizedMsg = msg.grammar_text
          .replace(/\n{3,}/g, "\n\n")
          .replace(/\*/g, "")
          .replace(/-\s+/g, "");

        dispatch(receiveMessage(sanitizedMsg));
        dispatch(checkForMistakes(sanitizedMsg));
      };

      socket.onclose = () => {
        console.log("Closed");
      };

      return socket;
    } catch (error) {
      console.log("an error occured");
    }
  }
);

export const socketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    updateSocketState(state, action) {
      const { key, value } = action.payload;
      if (key in state) state[key] = value;
    },

    receiveMessage: (state, action) => {
      state.correctedMessage = action.payload;
    },

    disconnectSocket: (state) => {
      if (state.socket) {
        state.socket.close();
        state.socket = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(socketInitializer.fulfilled, (state, action) => {
      state.socket = action.payload;
    });
  },
});

export const { receiveMessage, disconnectSocket, updateSocketState } =
  socketSlice.actions;
export default socketSlice.reducer;
