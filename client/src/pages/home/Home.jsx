import React from "react";
import { Sidebar } from "../../components/Sidebar";
import { MessagesContainer } from "../../components/MessagesContainer";

// home
const Home = () => {
  return (
    // main container
    <div className="main-home container-fluid p-0 ">
      {/* boostrap row with full height of  */}
      <div className="main-row row m-0 p-0">
        {/* left side of row */}
        <Sidebar />
        {/* left side end */}

        {/* right side of row */}
        <MessagesContainer />
        {/* right side end */}
      </div>
      {/* bootstrap row's end */}
    </div>
    // main div end
  );
};

export default Home;
