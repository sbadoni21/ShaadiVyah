"use client";
import ContactUSPhoto from "@/components/ContactUSPhoto";
import DestinationCard from "@/components/DestinationCard";
import Discription from "@/components/Discription";
import FAQ from "@/components/FAQ";
import HeadingsVenueSection from "@/components/HeadingsVenueSection";
import Hero_2 from "@/components/Hero_2";
import Space25px from "@/components/Space25px";
import Space50px from "@/components/Space50px";
import React, { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const Page = () => {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("vendorTypeUID", "==", "photographervendor")
        );
        const dataSnapshot = await getDocs(q);
        const dataList = dataSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVenues(dataList);
      } catch (error) {
        console.error("Error fetching venues: ", error);
      }
    };

    fetchVenues();
  }, []);

  return (
    <>
      <Hero_2
        img={"/images/venus_page.png"}
        text={"Lorem ipsum dolor sit amet consectetur."}
      />
      <Space50px />
      <HeadingsVenueSection text1={"Weddings"} text2={"Destinations"} />
      <Space25px />
      <div className="flex justify-center items-center px-6 gap-8">
      </div>
      <Space25px />
      <HeadingsVenueSection text1={"Popular"} text2={"Destinations"} />
      <DestinationCard venues={venues} />
      <Space50px />
      <Space50px />
      <ContactUSPhoto />
      <Space50px />
      <Space50px />
      <Discription />
      <div>
        <FAQ />
      </div>
    </>
  );
};

export default Page;