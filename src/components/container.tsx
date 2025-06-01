import React from "react";

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className=" max-w-[1280px] xl:px-30  md:px-14 sm:px-10 px-8 ">
      {children}
    </div>
  );
};

export default Container;
