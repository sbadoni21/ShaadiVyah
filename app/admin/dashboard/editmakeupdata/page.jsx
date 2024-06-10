"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/firebase/firebase"; // Adjust the path to your Firebase configuration
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const AmenitiesPage = () => {
  const [makeup, setMakeup] = useState([]);
  const [makeupFormData, setmakeupFormData] = useState({ name: "" });
  const [isEditingmakeup, setIsEditingmakeup] = useState(false);
  const [editingIDmakeup, setEditingIDmakeup] = useState(null);

  useEffect(() => {
    const fetchMakeup = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "makeupServices"));
        const data = querySnapshot.docs.map((doc) => ({
          name: doc.data().name,
          id: doc.id,
        }));
        setMakeup(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchMakeup();
  }, []);

  const handleChangeMakeup = (e) => {
    const { name, value } = e.target;
    setmakeupFormData({ ...makeupFormData, [name]: value });
  };

  const handleSubmitMakeup = async (e) => {
    e.preventDefault();
    if (isEditingmakeup) {
      await handleEditMakeup(editingIDmakeup, makeupFormData.name);
    } else {
      await handleAddMakeup(makeupFormData.name);
    }
    setmakeupFormData({ name: "" });
    setIsEditingmakeup(false);
    setEditingIDmakeup(null);
  };

  const handleAddMakeup = async (name) => {
    try {
      const docRef = await addDoc(collection(db, "makeupServices"), { name });
      setMakeup([...makeup, { name, id: docRef.id }]);
      toast.success("Added successfully!");
    } catch (error) {
      console.error("Error adding ", error);
      toast.error("Error adding ");
    }
  };

  const handleEditMakeup = async (id, name) => {
    try {
      const spaceRef = doc(db, "makeupServices", id);
      await updateDoc(spaceRef, { name });
      setMakeup(makeup.map((data) => (data.id === id ? { name, id } : data)));
      toast.success("Makeup updated successfully!");
    } catch (error) {
      console.error("Error updating: ", error);
      toast.error("Error updating.");
    }
  };

  const handleDeleteMakeup = async (id) => {
    try {
      await deleteDoc(doc(db, "makeupServices", id));
      setMakeup(makeup.filter((f) => f.id !== id));
      toast.success("Makeup Services deleted successfully!");
    } catch (error) {
      console.error("Error deleting makeupServices: ", error);
      toast.error("Error deleting makeupServices.");
    }
  };

  const startEditingMakeup = (id, name) => {
    setIsEditingmakeup(true);
    setEditingIDmakeup(id);
    setmakeupFormData({ name });
  };

  return (
    <div className="p-4">
      <ToastContainer />

      <h1 className="text-2xl font-bold mb-4 backdrop-blur-sm fixed">
        Makeup Services
      </h1>
      <form onSubmit={handleSubmitMakeup} className="mb-4 mt-20">
        <input
          type="text"
          name="name"
          value={makeupFormData.name}
          onChange={handleChangeMakeup}
          className="p-2 border border-gray-300 rounded mr-2"
          placeholder="Additional Service Name"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white bg-pink rounded"
        >
          {isEditingmakeup ? "Update" : "Add"}
        </button>
      </form>
      {makeup.length > 0 ? (
        <div className="h-56 overflow-y-scroll">
          {makeup.map((data, index) => (
            <div
              key={index}
              className="mb-2 p-2 border border-gray-300 rounded flex justify-between items-center"
            >
              <div>
                <p className="text-lg">
                  <strong>Name:</strong> {data.name}
                </p>
              </div>
              <div>
                <button
                  onClick={() => startEditingMakeup(data.id, data.name)}
                  className="text-green-500 text-xl"
                >
                  <MdEdit />
                </button>
                <button
                  onClick={() => handleDeleteMakeup(data.id)}
                  className=" text-red-500 text-xl "
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No Makeup keywords available</p>
      )}
    </div>
  );
};

export default AmenitiesPage;