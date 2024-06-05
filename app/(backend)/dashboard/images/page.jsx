"use client";
import React, { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/firebase/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove, getDocs, collection, query, where } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { parseCookies } from "nookies";
import { generatePassword } from "@/utils/generatePassword";
import { FiGift, FiHome, FiImage, FiTag } from "react-icons/fi";

const Portfolio = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [venueLinks, setVenueLinks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const cookies = parseCookies();
    const uid = cookies.token;

    const fetchUser = async () => {
      if (uid) {
        const q = query(collection(db, "users"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUser(userData);
          setVenueLinks(userData.venueLinks || []);
          setBannerImageUrl(userData.bannerImageUrl || "");
        }
      }
    };

    fetchUser();
  }, []);

  const handleBannerImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsLoading(true);

    try {
      const bannerRef = ref(storage, `bannerImages/${user.uid}/banner.jpg`);
      await uploadBytes(bannerRef, file);
      const downloadURL = await getDownloadURL(bannerRef);
      setBannerImageUrl(downloadURL);
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { bannerImageUrl: downloadURL });

      toast.success("Banner image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading banner image: ", error);
      toast.error("Error uploading banner image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBannerImage = async () => {
    try {
      const bannerRef = ref(storage, `bannerImages/${user.uid}/banner.jpg`);
      await deleteObject(bannerRef);
      setBannerImageUrl("");

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { bannerImageUrl: "" });

      toast.success("Banner image deleted successfully!");
    } catch (error) {
      console.error("Error deleting banner image: ", error);
      toast.error("Error deleting banner image.");
    }
  };

  const handleVenueFilesChange = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    setIsLoading(true);

    try {
      const userRef = doc(db, "users", user.uid);
      const venueUrls = [];
      for (const file of files) {
        const venueRef = ref(storage, `bannerImages/${user.uid}/portfolio/${generatePassword()}`);
        await uploadBytes(venueRef, file);
        const downloadURL = await getDownloadURL(venueRef);
        venueUrls.push(downloadURL);
        await updateDoc(userRef, { venueLinks: arrayUnion(downloadURL) });
      }

      setVenueLinks((prevLinks) => [...prevLinks, ...venueUrls]);

      toast.success("Venue images uploaded successfully!");
    } catch (error) {
      console.error("Error uploading venue images: ", error);
      toast.error("Error uploading venue images.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVenueImage = async (index) => {
    try {
      const imageURL = venueLinks[index];
      const venueRef = ref(storage, imageURL);

      await deleteObject(venueRef);
      const updatedLinks = venueLinks.filter((_, i) => i !== index);
      setVenueLinks(updatedLinks);

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { venueLinks: arrayRemove(imageURL) });

      toast.success("Venue image deleted successfully!");
    } catch (error) {
      console.error("Error deleting venue image: ", error);
      toast.error("Error deleting venue image.");
    }
  };

  return (
    <>
      <div className="md:m-10 m-4">
        <ToastContainer />
        <div className="flex flex-col gap-4">
          <p className="font-medium">BANNER IMAGE</p>
          <div className="flex gap-6 pl-[20px] lg:w-[46vw] md:w-[56vw] w-[80vw] py-[16px] border border-[#E7E7E7] rounded-lg">
            <input
              type="file"
              name="bannerImage"
              id="image-upload"
              style={{ display: "none" }}
              onChange={handleBannerImageChange}
            />
            <label
              htmlFor="image-upload"
              className="px-4 py-2 rounded bg-[#A11C5C] text-white cursor-pointer"
            >
              {isLoading ? "Loading.." : "Upload"}
            </label>
          </div>
        </div>
        {bannerImageUrl && (
          <div className="relative w-[146px] h-[107px] mt-4">
            <img
              src={bannerImageUrl}
              alt="Banner Image"
              className="w-full h-full object-contain border border-gray-200"
            />
            <button
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded"
              onClick={handleDeleteBannerImage}
            >
              Delete
            </button>
          </div>
        )}
        <div className="flex flex-col gap-4 mt-4">
          <p className="font-medium">PORTFOLIO IMAGES</p>
          <div className="pl-[20px] lg:w-[46vw] md:w-[56vw] w-[80vw] py-[16px] border border-[#E7E7E7] rounded-lg">
            <input
              type="file"
              multiple
              onChange={handleVenueFilesChange}
            />
          </div>
        </div>
        <div className="flex gap-4 flex-wrap mt-4">
          {venueLinks &&
            venueLinks.map((link, index) => (
              <div key={index} className="relative w-[146px] h-[107px]">
                <img
                  src={link}
                  alt={`Venue Image ${index + 1}`}
                  className="w-full h-full object-contain border border-gray-200"
                />
                <button
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded"
                  onClick={() => handleDeleteVenueImage(index)}
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      </div>
      <div className="w-screen bg-gradient-to-r from-[#FF1053] to-[#F7ACCF] text-white flex justify-between fixed bottom-0 lg:hidden px-4">
        <div className="py-[20px]"><FiHome className="w-[40px] h-[40px]" /></div>
        <div className="py-[20px]"><FiTag className="w-[40px] h-[40px]" /></div>
        <div className="py-[20px]"><FiImage className="w-[40px] h-[40px]" /></div>
        <div className="py-[20px]"><FiGift className="w-[40px] h-[40px]" /></div>
      </div>
    </>
  );
};

export default Portfolio;
