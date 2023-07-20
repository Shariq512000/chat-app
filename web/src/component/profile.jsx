import { useContext } from "react";
import { GlobalContext } from '../context/Context';

import coverImage from "../images/coverPhoto1.png";
import profileImage from "../images/profilePhoto1.jpg";
import "./product.css";



function Profile() {
  let { state, dispatch } = useContext(GlobalContext);

  



  return (
    <div>
      <div className="cover">
        <img src={coverImage} alt="" />
      </div>
      <div className="profile">
        <img src={profileImage} alt="" />
        <span> {state?.user?.firstName}  {state?.user?.lastName} </span>
      </div>
    </div>

  )

}
export default Profile;