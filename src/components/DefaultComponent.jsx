import React from 'react';
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";

const DefaultComponent = ({children}) => {
   return (
      <div>
         <HeaderComponent />
         {children}
         <FooterComponent />
      </div>
   )
};

export default DefaultComponent;
