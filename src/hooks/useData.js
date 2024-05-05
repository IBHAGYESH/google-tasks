import { useContext } from "react";
import DataContext from "../context/DataProvider";

const useData = () => {
  const { data, setData } = useContext(DataContext);
  const resetData = () => {
    setData({});
  };
  return { data, setData, resetData };
};

export default useData;
