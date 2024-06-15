import { useEffect, useState } from "react";

const SearchComponent = function () {
  const [searchInput, setSearchInput] = useState("");

  useEffect(
    function () {
      console.log(`SearchInput Changed - ${searchInput}`);
    },
    [searchInput]
  );

  return (
    <>
      <div>search box</div>
      <div className="flex">
        <input
          type="text"
          onChange={(event) => setSearchInput(event.target.value)}
        />
      </div>
    </>
  );
};

export default SearchComponent;
