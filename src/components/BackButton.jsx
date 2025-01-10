import { MdArrowBackIosNew } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  // const location = useLocation()

  return (
    <button
    onClick={() => navigate(-1)}
      className="text-blue-600 text-base hover:bg-blue-600 hover:text-white border-blue-600 px-5 py-1 border rounded-md flex items-center justify-center gap-2 font-medium"
    >
      <MdArrowBackIosNew className="text-xs" /> Back
    </button>
  );
};

export default BackButton;