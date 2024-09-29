import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  divValue: "",
  plainText: "",
  errorsArr: [],
  isLoading: false,
  isFocused: false,
  wordCount: 0,
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    updateState(state, action) {
      const { key, value } = action.payload;
      state[key] = value;
    },

    updateWholeState(state, action) {
      for (let key in action.payload) state[key] = action.payload[key];
    },    

    checkForMistakes(state, action) {
      let updatedTxt = [];
      let updatedErrors = [];

      const sanitizedPlainText = state.plainText.replace(/\n{3,}/g, "\n\n");
      const sanitizedCorrectedText = action.payload;

      const originArr = sanitizedPlainText.split(/(\s+)/);
      const newArr = sanitizedCorrectedText.split(/(\s+)/);

      originArr.forEach((txt, index) => {
        if (txt.trim() === "") {
          updatedTxt.push(txt);
        } else if (newArr[index] === txt) {
          updatedTxt.push(`<span>${txt}</span>`);
        } else {
          updatedTxt.push(
            `<span class="border-b border-red-600">${txt}</span>`
          );
          updatedErrors.push({
            wrong: txt,
            correct: newArr[index],
          });
        }
      });

      state.divValue = updatedTxt.join("");
      state.errorsArr = [...updatedErrors];
      state.isLoading = false;
      state.wordCount = originArr.filter(
        (word) => word.trim() !== "" && !/\s+/.test(word)
      ).length;
    },
  },
});

export const { updateState, checkForMistakes, updateWholeState } = messageSlice.actions;
export default messageSlice.reducer;