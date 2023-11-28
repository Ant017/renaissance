import Button from "../../atoms/Button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoMdNotifications } from "react-icons/io";
import { VscBellDot } from "react-icons/vsc";
import { jwtDecode } from "jwt-decode";
import useSubscription from "../../../hooks/useSubscriptionHooks";
import { useState, useEffect } from "react";
import { axiosInstance } from "../../../utils/axiosInstance";
import { GoDotFill } from "react-icons/go";
import { FaCartShopping } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa6";
import Rating from "react-rating-stars-component";
import '../../../utils/scrollbar.css'

type From = {
  _id: string;
  username: string;
  email: string;
};

type Req = {
  _id: string;
  type: string;
  message: string;
  to: string;
  from: From | null;
  courseID: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type Course = {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  requirement: string[];
  lessonID: string[];
  rating: number;
  reviews: string[];
  language: string;
};

type CartData = {
  _id: string;
  studentID: string;
  courseID: Course[];
};

type MyToken = {
  _id: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  isBanned: boolean;
  teacherID?: string;
  iat: number;
  exp: number;
};

const LoginSignUpNavMolecule = () => {
  const navigate = useNavigate();
  const state = useSelector((state: any) => state.user);

  const checkString = state.token;

  if (!checkString) {
    return (
      <div className="flex gap-3 mr-10">
        <Button
          type="button"
          value="Login"
          additionalStyles="bg-blue-500 hover:bg-blue-700 text-white w-20"
          onClick={() => navigate("/login")}
        />
        <div className="border-l border-solid border-gray-400 h-10"></div>
        <Button
          type="button"
          value="Register"
          additionalStyles="bg-blue-500 hover:bg-blue-700 text-white w-20"
          onClick={() => navigate("/signup")}
        />
      </div>
    );
  }

  const decodedToken = jwtDecode<MyToken>(checkString);

  const [notifications, setNotifications] = useState<Req[]>([]);
  const [teacherNotifications, setTeacherNotifications] = useState<Req[]>([]);
  const [isUnread, setIsUnread] = useState(false);
  const [showUnreadNotifications, setShowUnreadNotifications] = useState(false);

  const [cartData, setCartData] = useState<CartData | null>(null);
  const [wishlistData, setWishlistData] = useState<CartData | null>(null);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get(
          "/notification/show-all-notification",
          {
            headers: {
              Authorization: `Bearer ${checkString}`,
              "Content-Type": "application/json",
            },
          }
        );
        setNotifications(response.data.data);

        // Check if there are unread notifications
        const hasUnreadNotifications =
          response.data.data.length > 0 &&
          response.data.data.some(
            (notification: any) =>
              notification.status === "unread" &&
              notification.type !== "course_subscribed"
          );

        setIsUnread(hasUnreadNotifications);
        if (!hasUnreadNotifications) {
          setNotifications([]);
        }
        console.log("Has unread notifications:", hasUnreadNotifications);
      } catch (error) {
        console.error("Error fetching subscription requests:", error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const fetchTeachersNotifications = async () => {
      try {
        const response = await axiosInstance.get(
          "/notification/show-teachers-notification",
          {
            headers: {
              Authorization: `Bearer ${checkString}`,
              "Content-Type": "application/json",
            },
          }
        );
        setTeacherNotifications(response.data.data);

        // Check if there are unread notifications
        const hasUnreadNotifications =
          response.data.data.length > 0 &&
          response.data.data.some(
            (notification: any) => notification.type === "course_subscribed" || notification.type === "assignment_submitted"
          );

        setIsUnread(hasUnreadNotifications);
        if (!hasUnreadNotifications) {
          setTeacherNotifications([]);
        }
        console.log("Has unread notifications:", hasUnreadNotifications);
      } catch (error) {
        console.error("Error fetching subscription requests:", error);
      }
    };

    fetchTeachersNotifications();
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axiosInstance.get("/cart/get-your-cart", {
          headers: {
            Authorization: `Bearer ${checkString}`,
            "Content-Type": "application/json",
          },
        });
        setCartData(response.data.data);
      } catch (error) {
        console.error("Error fetching subscription requests:", error);
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axiosInstance.get(
          "/wishlist/get-your-wishlist",
          {
            headers: {
              Authorization: `Bearer ${checkString}`,
              "Content-Type": "application/json",
            },
          }
        );
        setWishlistData(response.data.data);
      } catch (error) {
        console.error("Error fetching subscription requests:", error);
      }
    };

    fetchWishlist();
  }, []);

  const handleClick = () => {
    setShowUnreadNotifications(!showUnreadNotifications);
  };

  const handleCartClick = () => {
    if (showWishlist) {
      setShowWishlist(false);
    }
    setShowCart(!showCart);
  };

  const handleWishlistClick = () => {
    if (showCart) {
      setShowCart(false);
    }
    setShowWishlist(!showWishlist);
  };

  console.log("length", teacherNotifications);
  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.status === "unread" &&
      notification.type !== "course_subscribed"
  );

  if (decodedToken.role === "admin") {
    return (
      <div className="flex gap-5">
        <div className="relative group">
          {isUnread ? (
            <div>
              <IoMdNotifications
                className="font-bold text-2xl cursor-pointer"
                onClick={handleClick}
              />
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center">
                {filteredNotifications.length}
              </div>
            </div>
          ) : (
            <IoMdNotifications
              className="font-bold text-xl cursor-pointer"
              onClick={handleClick}
            />
          )}

          {showUnreadNotifications && (
            <div className="absolute top-[50px] right-0 p-4 bg-white shadow-md rounded">
              <div className="overflow-y-scroll max-h-96 w-[400px] rounded-lg custom-scrollbar">
                {notifications
                  .filter(
                    (notification) =>
                      notification.status === "unread" &&
                      notification.type !== "course_subscribed"
                  )
                  .map((notification) => (
                    <div key={notification._id}>
                      <div className="flex items-center gap-2">
                        <GoDotFill className="text-red-500" />
                        <p className="max-w-xs">{notification.message}</p>
                      </div>
                      <hr className="my-6" />
                    </div>
                  ))}
              </div>
              {notifications.every(
                (notification) => notification.status !== "unread"
              ) && <p>No unread notifications</p>}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (decodedToken.role === "teacher") {
    return (
      <div className="flex gap-5">
        <div className="relative group">
          {teacherNotifications ? (
            <div>
              <IoMdNotifications
                className="font-bold text-2xl cursor-pointer"
                onClick={handleClick}
              />
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center">
                {teacherNotifications.length}
              </div>
            </div>
          ) : (
            <IoMdNotifications
              className="font-bold text-xl cursor-pointer"
              onClick={handleClick}
            />
          )}

          {showUnreadNotifications && (
            <div className="absolute top-[50px] right-0 p-4 bg-white shadow-md rounded">
              <div className="overflow-y-scroll max-h-96 w-[400px] rounded-lg custom-scrollbar">
                {teacherNotifications
                  .filter((notification) => notification.status === "unread")
                  .map((notification) => (
                    <div key={notification._id}>
                      <div className="flex items-center gap-2">
                        <GoDotFill className="text-red-500" />
                        <p className="max-w-xs">{notification.message}</p>
                      </div>
                      <hr className="my-6" />
                    </div>
                  ))}
              </div>
              {teacherNotifications.every(
                (notification) => notification.status !== "unread"
              ) && <p>No unread notifications</p>}
            </div>
          )}
        </div>
      </div>
    );
  }
  if (decodedToken.role === "student") {
    return (
      <div className="flex gap-8">
        <div className="relative group">
          {cartData && cartData.courseID.length > 0 ? (
            <div>
              <FaCartShopping
                className="font-bold text-2xl cursor-pointer"
                onClick={handleCartClick}
              />
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center">
                {cartData.courseID.length}
              </div>
            </div>
          ) : (
            <FaCartShopping
              className="font-bold text-xl cursor-pointer"
              onClick={handleCartClick}
            />
          )}
          {showCart && (
            <div className="absolute w-[300px] top-[60px] right-[-10px] p-4 bg-white shadow-md rounded">
              <div className="max-h-96">
                {cartData && cartData.courseID.length > 0 ? (
                  <div key={cartData._id} className="flex flex-col gap-2">
                    {cartData.courseID.map((course: any) => (
                      <div key={course._id} className="flex gap-3 items-center">
                        <img
                          src={course.thumbnail}
                          className="w-[70px] h-[50px] object-cover rounded"
                        ></img>
                        <div className="flex flex-col gap-0">
                          <p>{course.title}</p>
                          <div className="flex items-center">
                            <Rating
                              count={5}
                              value={course?.rating || 0}
                              size={24}
                              edit={false}
                              activeColor="#FFD700"
                              color="#A0A0A0"
                              className="rounded"
                            />
                            <span className="text-gray-700">
                              {course?.reviews && `(${course.reviews.length})`}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No cart found</p>
                )}
              </div>
            </div>
          )}
        </div>
        {/* wishlist */}
        <div className="relative group">
          {wishlistData && wishlistData.courseID.length > 0 ? (
            <div>
              <FaHeart
                className="font-bold text-2xl cursor-pointer"
                onClick={handleWishlistClick}
              />
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center">
                {wishlistData.courseID.length}
              </div>
            </div>
          ) : (
            <FaHeart
              className="font-bold text-xl cursor-pointer"
              onClick={handleWishlistClick}
            />
          )}
          {showWishlist && (
            <div className="absolute w-[300px] top-[60px] right-[-10px] p-4 bg-white shadow-md rounded">
              <div className="max-h-96">
                {wishlistData && wishlistData.courseID.length > 0 ? (
                  <div key={wishlistData._id} className="flex flex-col gap-2">
                    {wishlistData.courseID.map((course: any) => (
                      <div key={course._id} className="flex gap-3 items-center">
                        <img
                          src={course.thumbnail}
                          className="w-[70px] h-[50px] object-cover rounded"
                        ></img>
                        <div className="flex flex-col gap-0">
                          <p>{course.title}</p>
                          <div className="flex items-center">
                            <Rating
                              count={5}
                              value={course?.rating || 0}
                              size={24}
                              edit={false}
                              activeColor="#FFD700"
                              color="#A0A0A0"
                              className="rounded"
                            />
                            <span className="text-gray-700">
                              {course?.reviews && `(${course.reviews.length})`}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No wishlist found</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default LoginSignUpNavMolecule;
