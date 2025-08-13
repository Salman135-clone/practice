import React, { useEffect, useRef, useState, useMemo } from "react";
import JoditEditor from "jodit-react";
import { toast } from "react-toastify";
import { db } from "../constant/Firebase";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { CircularProgress } from "@mui/joy";
import { authProvider } from "../context/MyProvider";
import { useNavigate, useParams } from "react-router-dom";
import Dashboard from "../pages/Dashboard";

const AddPost = () => {
  const navigate = useNavigate();
  const editor = useRef();
  const { categoriesData } = authProvider();
  const { id } = useParams();
  const { user } = authProvider();
  const [loading, setLoading] = useState(false);
  // const [preveiw, setPreview] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handlePreview = () => {
    const previewWindow = window.open("", "_blank");

    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title}</title>
          </head> 
          <body>
            <h1>${title}</h1>
            <div>${content}</div>
          </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: content ? "" : "",
    }),
    []
  );

  const clearField = () => {
    setTitle(""), setContent(""), setSelectedCategory("");
  };

  const submitPost = async () => {
    if (!title || !content) {
      toast.error("Both field are require");
      return;
    }
    setLoading(true);
    try {
      if (id) {
        const docRef = doc(db, "blogs", id);
        await updateDoc(docRef, {
          title,
          content,
          category: selectedCategory,
          // updatedAt: Timestamp.now(),
        });
        toast.success("Update Successfully");
        navigate("/dashboard");
      } else {
        await addDoc(collection(db, "blogs"), {
          uid: localStorage.getItem("uid"),
          author: user.email,
          title: title,
          content: content,
          category: selectedCategory,
          createdAt: Timestamp.now(),
        });
        toast.success("Post Added Successfully");
        navigate("/dashboard");
      }
    } catch (error) {
      // console.log(error.message);
      toast.error(error.message);
    } finally {
      clearField();
      setLoading(false);
    }
  };

  useEffect(() => {
    const resetField = () => {
      setTitle("");
      setContent("");
      setSelectedCategory("");
    };

    if (id) {
      const fetchingData = async () => {
        const docRef = doc(db, "blogs", id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setTitle(data.title);
          setContent(data.content);
          setSelectedCategory(data.category);
        }
      };
      fetchingData();
    } else {
      resetField();
    }
  }, [id]);

  return (
    <>
      <div className="mt-4 px-4">
        <span className="text-2xl font-semibold"> For Add Post</span>
        <div className="m-auto flex flex-col gap-5 mt-4 ">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 p-1"
          >
            <option value="" disabled>
              Select Category
            </option>
            {categoriesData.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <div>
            <label htmlFor="title" className="font-semibold">
              Title
            </label>
            <input
              className="mt-2 border border-slate-300 rounded w-full px-1 py-1"
              type="text"
              name="title"
              id="title"
              placeholder="Write Title Here..."
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="discription" className="font-semibold">
              Discription
            </label>
            <JoditEditor
              ref={editor}
              name="content"
              config={config}
              value={content}
              onBlur={(newContent) => setContent(newContent)}
            />
          </div>
          <div className="button">
            <button
              onClick={submitPost}
              disabled={loading}
              className="bg-green-500 text-white text-xl px-2 py-1 font-semibold cursor-pointer rounded "
            >
              {loading ? (
                <CircularProgress
                  size="sm"
                  variant="solid"
                  className="cursor-not-allowed"
                />
              ) : id ? (
                "Update"
              ) : (
                "Add Post"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default AddPost;
