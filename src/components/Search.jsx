import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const SearchComponent = function () {
  const navigate = useNavigate();
  const { word } = useParams();
  const [searchInput, setSearchInput] = useState(word || "");
  const [meaning, setMeaning] = useState("");

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getMeaning = useCallback(
    (input) => {
      axios
        .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${input}`)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
      navigate(`/search/${input}`);
    },
    [navigate]
  );

  const getWordOfDay = () => {
    axios
      .get(`https://api-portal.dictionary.com/editorial/wotd`)
      .then((res) => {
        setSearchInput(res.data?.wordoftheday?.results["2024-08-19"]?.word);
        setMeaning(
          res.data?.wordoftheday?.results["2024-08-19"]?.short_definition
        );
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (word) {
      setSearchInput(word);
      getMeaning(word);
    } else {
      getWordOfDay();
    }
  }, [word, getMeaning]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      getMeaning(searchInput);
    }
  };

  return (
    <>
      <div className="flex center">
        <input
          type="text"
          placeholder="Search here..."
          onChange={(event) => setSearchInput(event.target.value)}
          onKeyDown={(e) => {
            handleSearch(e);
          }}
        />
      </div>
      {meaning ? (
        <div>
          <div className="flex center word">
            <h3>{searchInput}</h3>
          </div>
          <div className="flex center word">{meaning}</div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default SearchComponent;
