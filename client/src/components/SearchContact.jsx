import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const SearchContact = () => {
  const [search, setSearch] = useState("");
  const { setSelectedContact, contactsArray } = useAuth();

  // handling submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(search);
    // console.log(contactsArray);
    if (!search) {
      return toast.error("Type Something...");
    }

    if (search.length < 3) {
      return toast.error("Character Length Must be greater than 3!");
    }

    const searchTerms = search.toLowerCase().split(" ");
    const searchedContact = contactsArray.find((contact) => {
      return searchTerms.every(
        (term) =>
          contact.firstName.toLowerCase().includes(term) ||
          contact.lastName.toLowerCase().includes(term)
      );
    });

    if (searchedContact) {
      setSelectedContact(searchedContact);
    } else {
      toast.error("No Contact Found!");
    }
  };

  return (
    <>
      <div className="left-top d-flex align-items-center justify-content-center container-fluid">
        <form
          onSubmit={handleSubmit}
          className="d-flex align-items-center justify-content-center"
        >
          <div className="search-bar p-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              style={{
                border: "none",
                outline: "none",
                boxShadow: "none",
              }}
              onFocus={(e) => (e.target.style.boxShadow = "none")}
              onBlur={(e) => (e.target.style.boxShadow = "none")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="btn btn-light btn-block search-btn-left"
            style={{ height: "40px" }}
            type="submit"
          >
            <FaSearch
              style={{
                fontSize: "20px",
                width: "20px",
              }}
            />
          </button>
        </form>
      </div>
    </>
  );
};

export default SearchContact;
