import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import Words from "./Words";

const SearchComponent = function () {
  const navigate = useNavigate();
  const { word } = useParams();
  const [searchInput, setSearchInput] = useState(word || "");
  const [searchWord, setSearchWord] = useState(word || "");
  const [meaning, setMeaning] = useState("");
  const [definitions, setDefinitons] = useState([]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  //---API Call to get the meaning of searched word
  const getMeaning = useCallback(
    (input) => {
      axios
        .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${input}`)
        .then((res) => {
          setDefinitons(
            res.data.flatMap((details) => {
              return (
                <div>
                  {details.meanings.flatMap((meaning) => {
                    return (
                      <div>
                        {meaning.definitions.flatMap((definition) => {
                          return <div>{definition.definition}</div>;
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })
          );
        })
        .catch((err) => console.log(err));
    },
    [definitions]
  );

  const getWordOfDay = useCallback(() => {
    axios
      .get(`https://api-portal.dictionary.com/editorial/wotd`)
      .then((res) => {
        setSearchWord(
          res.data?.wordoftheday?.results[formatDate(new Date())]?.word
        );
        setMeaning(
          res.data?.wordoftheday?.results[formatDate(new Date())]
            ?.short_definition
        );
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (word) {
      getMeaning(word);
    } else {
      getWordOfDay();
    }
  }, [word]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/search/${searchInput}`);
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

      {meaning && !word ? (
        <div>
          <div className="flex center word">
            <div className="text-2xl font-bold underline">{searchWord}</div>
          </div>
          <div className="flex center word">{meaning}</div>
        </div>
      ) : null}
      {definitions?.length ? <Words data={definitions} /> : null}
    </>
  );
};

export default SearchComponent;
