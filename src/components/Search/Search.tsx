/**
 * Search.tsx -  Publication search bar.
 */

 import React from "react";
 import { Form, InputGroup } from "react-bootstrap";
 import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
 import { faSearch } from "@fortawesome/free-solid-svg-icons";
 import { useNavigate } from "react-router-dom";
 import "./Search.css";

 
 
 /**
  * Search - Functional Component.
  *          It adapts to different types of screen.
  *          This input bar remains visible throughout the life cycle of the MiniDev application.
  *
  *          It refers to the publications page (navigate), indicating that the search is from the string entered in "search".
  *          In the case of not having entered a search text, it is indicated by "@all" that all publications will be searched.
  *
  * @returns - JSX element.
  */
 
 const Search = () => {
   const navigate = useNavigate();
 
   const handleKeyDown = async (event: any) => {
     let search: string = "@all";
     if (event.key !== "Enter") return;
     if (event.target.value) search = event.target.value;
     navigate(`/publications/${search}`);
   };
 
   return (
     <React.Fragment>
       <InputGroup className="search-styles">
         <InputGroup.Text id="basic-addon1" className="search-awesome-styles">
           <FontAwesomeIcon icon={faSearch} size="lg" />
         </InputGroup.Text>
         <Form.Control
           type="search"
           onKeyDown={handleKeyDown}
           placeholder="Search here..."
           aria-describedby="basic-addon1"
           className="search-input-styles"
         />
       </InputGroup>
     </React.Fragment>
   );
 };
 
 export default Search;
 