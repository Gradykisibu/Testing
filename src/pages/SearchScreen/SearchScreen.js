import React from "react";
import Search from "../../components/Search/Search";
import WithLoggin from "../../components/context/HOC/WithAuth";

function SearchScreen() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        background: "#101010",
      }}
    >
      <Search />
    </div>
  );
}

export default WithLoggin(SearchScreen);
