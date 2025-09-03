import React, { useEffect, useRef, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { db } from "../constant/Firebase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { authProvider } from "../context/MyProvider";
import Table from "../components/Table";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SideNav from "../components/SideNav";
import DashboardNav from "../components/DashboardNav";
import { Typography } from "@mui/material";
import DOMPurify from "dompurify";
import PermissionChecker from "../components/PermissionChecker";
import ActionButton from "../components/ActionButton";

const Dashboard = () => {
  const { userInfo } = authProvider();
  const navigate = useNavigate();
  const { user, categoriesData } = authProvider();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectCategory, setSelectedCategory] = useState("All");
  // console.log(sortColumn);

  const onViewOpen = () => setIsViewOpen(true);
  const onViewClose = () => setIsViewOpen(false);
  const displayData =
    search || selectCategory
      ? data.filter((item) => {
          const matchesSearch =
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.author.toLowerCase().includes(search.toLowerCase());

          const matchCategory =
            selectCategory === "All"
              ? true
              : selectCategory.toLowerCase() === item.category.toLowerCase();

          return matchesSearch && matchCategory;
        })
      : data;

  const handleSearch = (e) => {
    setSearch(e);
  };
  const handleDialog = (id) => {
    setOpen((prev) => !prev);
    setId(id);
  };
  const clearSearch = () => {
    setSearch("");
  };

  useEffect(() => {
    if (!user?.uid) return;
    const blogRef = collection(db, "blogs");
    let q;
    if (sortColumn && sortDirection) {
      q = query(blogRef, orderBy(sortColumn, sortDirection));
    } else {
      q = query(blogRef);
    }
    // const q = query(blogRef, where("uid", "==", user.uid));
    const fetching = onSnapshot(
      q,
      (snapshot) => {
        const getList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate().toLocaleDateString(),
        }));

        setData(getList);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        console.log(error.message);
        toast.error(error.message);
      }
    );

    return () => fetching();
  }, [sortColumn, sortDirection]);

  const deleteHandler = async (id) => {
    try {
      await deleteDoc(doc(db, "blogs", id));
      toast.success("Deleted Successfully");
      setData((prevData) => prevData.filter((newValue) => newValue.id !== id));
    } catch (error) {
      toast.error(error.message);
    }
  };
  const columns = [
    {
      header: "Title",
      accessor: "title",
      render: (row) => (
        <div className="min-w-[150px] max-w-[150px] truncate whitespace-nowrap overflow-hidden">
          {row.title}
        </div>
      ),
    },
    {
      header: "Author",
      accessor: "author",
      render: (row) => (
        <div className=" min-w-[150px] max-w-[200px] truncate whitespace-nowrap overflow-hidden">
          {row.author}
        </div>
      ),
    },
    {
      header: "Category  ",
      accessor: "category",
      render: (row) => (
        <div className="max-w-[200px] truncate whitespace-nowrap overflow-hidden">
          {row.category}
        </div>
      ),
    },
    {
      header: "Created At",
      accessor: "createdAt",
      render: (row) => (
        <div className="max-w-[200px] truncate whitespace-nowrap overflow-hidden">
          {row.createdAt}
        </div>
      ),
    },

    {
      header: "Actions",
      disableSort: true,
      render: (dataRow) => (
        <div className="flex gap-2">
          <PermissionChecker name="view-post">
            <button
              onClick={() => {
                setViewData(dataRow);
                onViewOpen();
              }}
              className="bg-blue-200 cursor-pointer font-semibold hover:bg-blue-500 hover:text-white text-sm px-2 py-1 rounded-sm"
            >
              View
            </button>
          </PermissionChecker>

          <PermissionChecker name="update-post">
            <button
              onClick={() => {
                navigate(`/post/${dataRow.id}`);
              }}
              className="bg-green-200 cursor-pointer font-semibold hover:bg-green-500 hover:text-white text-sm px-2 py-1 rounded-sm disabled:bg-gray-300 disabled:text-gray-500"
            >
              Update
            </button>
          </PermissionChecker>

          <PermissionChecker name="delete-post">
            <ActionButton
              permission="delete-post"
              onClick={() => handleDialog(dataRow.id)}
              disabledColor="disabled:bg-gray-300 disabled:text-gray-500"
              normalColor="bg-red-400 hover:text-white"
              defaultStyle="cursor-pointer font-semibold px-2 py-1 rounded-sm"
            >
              Delete
            </ActionButton>
          </PermissionChecker>
        </div>
      ),
    },
  ];
  return (
    <>
      <div className="dashboard pt-8">
        <span className="font-bold text-3xl">Blog List</span>
        <div className=" mt-4">
          <div className="">
            <div className=" flex w-full items-center gap-4 py-2 mb-2 flex-wrap">
              <div className="flex gap-1 items-center">
                <label className="text-sm font-medium text-gray-600">
                  From:
                </label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                  />
                </LocalizationProvider>
              </div>

              <div className="flex gap-1 items-center">
                <label className="text-sm font-medium text-gray-600">To:</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                  />
                </LocalizationProvider>
              </div>
              <div className="relative min-w-full sm:min-w-[500px]">
                <input
                  className={`border border-gray-300 ${
                    search.length > 0 ? `pr-[30px] pl-2` : `pl-[40px]`
                  } py-2 rounded-sm w-full `}
                  type="text"
                  onChange={(e) => handleSearch(e.target.value)}
                  value={search}
                  placeholder="Search For Filter"
                />
                {search.length > 0 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 absolute top-2 right-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={() => clearSearch()}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 absolute top-2 left-2.5 text-gray-400 cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                    />
                  </svg>
                )}
              </div>
              <div>
                <select
                  className="border py-2 px-2 rounded-sm border-gray-300 "
                  value={selectCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All" disabled>
                    Select Category
                  </option>
                  {categoriesData.map((cty) => (
                    <option value={cty.name} key={cty.id}>
                      {cty.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Table
              columns={columns}
              loading={loading}
              data={displayData}
              sortColumn={sortColumn}
              setSortColumn={setSortColumn}
              setSortDirection={setSortDirection}
              sortDirection={sortDirection}
            />
          </div>
        </div>
        <Dialog open={open} onClose={handleDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <span className="text-red-400">
                Are you sure you want to delete this blog?
              </span>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                deleteHandler(id);
                handleDialog();
              }}
              color="error"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={isViewOpen} onClose={onViewClose} fullWidth maxWidth="md">
          <DialogTitle>Blog Detail</DialogTitle>
          <DialogContent dividers>
            {viewData ? (
              <>
                <Typography variant="subtitle1">
                  <strong>Title:</strong> {viewData.title}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Author:</strong> {viewData.author}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Category:</strong> {viewData.category}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Created At:</strong> {viewData.createdAt}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 2 }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      viewData.content || "No description provided."
                    ),
                  }}
                />
              </>
            ) : (
              <Typography>No blog selected.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onViewClose} variant="contained" color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default Dashboard;
