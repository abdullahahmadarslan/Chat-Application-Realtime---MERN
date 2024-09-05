import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { MessagesContainer } from "../../components/messages container/MessagesContainer";

// home
const Home = () => {
  return (
    // main container
    <div className="main-home container-fluid p-0 h-99 w-99">
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
