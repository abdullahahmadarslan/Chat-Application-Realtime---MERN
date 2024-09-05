import React, { useCallback, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import useStore from "../../stores/useStore";

const SearchContact = React.memo(() => {
  const [search, setSearch] = useState("");
  const { setSelectedContact, contactsArray } = useStore((state) => ({
    setSelectedContact: state.setSelectedContact,
    contactsArray: state.contactsArray,
  }));

  // Handling submit
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

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
    },
    [search, contactsArray, setSelectedContact]
  );

  return (
    <>
      <div
        className="left-top d-flex align-items-center justify-content-center container-fluid"
        style={{ height: "10%" }}
      >
        <form
          onSubmit={handleSubmit}
          className="d-flex align-items-center justify-content-center flex-column flex-sm-column flex-md-row flex-lg-row"
          style={{ width: "100%" }}
        >
          <div className="search-bar p-3 container-fluid ">
            <input
              type="text"
              className="form-control"
              placeholder="Search ..."
              style={{
                border: "none",
                outline: "none",
                boxShadow: "none",
                width: "100%",
              }}
              onFocus={(e) => (e.target.style.boxShadow = "none")}
              onBlur={(e) => (e.target.style.boxShadow = "none")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="btn btn-light btn-block search-btn-left rounded-5"
            style={{}}
            type="submit"
          >
            <FaSearch
              style={{
                fontSize: "19px",
              }}
            />
          </button>
        </form>
      </div>
    </>
  );
});

export default SearchContact;
