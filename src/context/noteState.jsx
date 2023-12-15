import NoteContext from "../context/noteContext";

const noteState = (props) => {
  const state = {
    name: "hemant",
    age: "15",
  };

  return (
    <NoteContext.Provider value={state}>{props.children}</NoteContext.Provider>
  );
};

export default noteState;
