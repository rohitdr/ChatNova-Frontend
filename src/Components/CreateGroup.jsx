import {
  CheckIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  PencilIcon,
  PlusIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";

import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import AuthContext from "../Context/AuthContext";
import NoServer from "./NoServer";
import ChatNovaContext from "../Context/ChatNovaContext";
import UserItem from "./UserItem";
import useDebounce from "./Hooks/Debouncer";

export default function CreateGroup() {

  const {
    searchUser,
    dataBaseUsers,
    createGroup,
    chattedUsersList,
    capitalizeFirstLetter,
  } = useContext(ChatNovaContext);

  const { isServerDown, showAlert, setActivePage } =
    useContext(AuthContext);

  const [groupImage, setGroupImage] = useState(null);

  const [addUser, setAddUser] = useState(false);
  const [searchingAddUser, setSearchingAddUser] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [formData, setFormData] = useState({ name: "", code: "" });
  const [preview, setPreview] = useState(null);
    const [searchValue, setSearchValue] = useState("");

  let pencilIconRef = useRef(null);
  let imageRef = useRef(null);

  useEffect(() => {
    if (!groupImage) return;

    const url = URL.createObjectURL(groupImage);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [groupImage]);

  const groupImagehandler = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showAlert("Error", "Image size should be less than 10mb");
      return;
    }

    setGroupImage(file);
  };

  const onChangeSearchAddUser = (e) => {
    let value = e.target.value;

    if (value.length === 0) {
      setAddUser(false);
      setSearchingAddUser(false);
    } else {
      setAddUser(true);
      setSearchingAddUser(true);
  setSearchValue(value)
    }
  };
  const debounceSearch = useDebounce(searchValue, 400);
  const lastValue = useRef("");

  useEffect(() => {
    if (
      debounceSearch.trim().length > 2 &&
      debounceSearch !== lastValue.current
    ) {
      lastValue.current = debounceSearch;
      searchUser(debounceSearch);
    }
  }, [debounceSearch, searchUser]);
  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!groupImage) return "Select a group image";
    if (formData.name.trim().length < 5)
      return "Group name must be ≥ 5 chars";
    if (formData.code.trim().length < 5)
      return "Invite code must be ≥ 5 chars";
    if (!selectedUsers.length) return "Select at least 1 user";
  };

  const handleCreateGroup = () => {
    const error = validate();

    if (error) {
      showAlert("Error", error);
      return;
    }

    createGroup(
      selectedUsers,
      formData.name,
      formData.code,
      groupImage
    );

    setGroupImage(null);
    setFormData({ name: "", code: "" });
    setSelectedUsers([]);
    setPreview(null);
  };

  const isSelected = (id) => {
    return selectedUsers.some((p) => p.user === id);
  };

  const handleAddMember = (id) => {
    setSelectedUsers((prev) => {
      if (prev.some((p) => p.user === id)) return prev;

      return [...prev, { user: id, role: "member" }];
    });
  };

  const handleRemoveMember = (id) => {
    setSelectedUsers((prev) => {
      const filtered = prev.filter((p) => p.user !== id);
      return filtered;
    });
  };

  const normalizeItem = useCallback((element, type) => {
    if (type === "chat") {
      return {
        element,
        name: element.user?.name,
        image: element.user?.image?.url,
        lastMessage: element.lastMessage,
        _id: element.user._id,
        unreadCount: element.unreadCount,
      };
    }

    if (type === "search") {
      return {
        element,
        name: element.name,
        image: element.image?.url,
        lastMessage: null,
        _id: element._id,
        unreadCount: element.unreadCount,
      };
    }
  }, []);

  const NormalizedChattedUsers = useMemo(() => {
    return chattedUsersList?.map((element) =>
      normalizeItem(element, "chat")
    );
  }, [chattedUsersList, normalizeItem]);

  const NormalizedDatabaseUsers = useMemo(() => {
    return dataBaseUsers?.map((element) =>
      normalizeItem(element, "search")
    );
  }, [dataBaseUsers, normalizeItem]);

  return isServerDown ? (
    <NoServer />
  ) : (
    <div>
      <div className="flex h-screen flex-col bg-[#F5F7FB] overflow-y-auto scrollbar-hide">

        {/* Header */}
        <div className="flex justify-between m-2 p-2 mt-0">
          <h2 className="text-2xl pt-2 font-medium">Create Group</h2>
        </div>

        {/* Image + Form */}
        <div className="bg-white mx-3 rounded-2xl shadow">
          <div className="flex flex-col items-center justify-center my-2">

            <div className="my-2 py-2 relative">
              <input
                ref={imageRef}
                type="file"
                id="GroupImage"
                accept="image/*"
                className="hidden"
                onChange={groupImagehandler}
              />

              <PencilIcon
                className="w-9 h-9 right-2 bg-white border border-black p-1.5 text-blue-900 cursor-pointer rounded-full bottom-3 absolute"
                onClick={() => imageRef.current.click()}
              />

              <img
                loading="lazy"
                onClick={() => imageRef.current.click()}
                className="w-28 h-28 rounded-full border-white border-4 shadow-md"
                src={
                  preview ||
                  ".././public/group-of-friends-sketch-vector-43422085.avif"
                }
                alt="Group Image"
              />
            </div>

            {/* Form */}
            <form className="w-full px-6 pb-4 flex flex-col gap-4">

              <div className="flex flex-col">
                <label
                  className="text-sm text-gray-500 mb-1"
                  htmlFor="group-name"
                >
                  Group Name
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  name="name"
                  value={formData.name}
                  id="group-name"
                  placeholder="Enter group name..."
                  className="px-4 py-2 rounded-xl border border-gray-300 bg-[#F9FAFA]
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             transition-all shadow-sm"
                />
              </div>

              <div className="flex flex-col">
                <label
                  className="text-sm text-gray-500 mb-1"
                  htmlFor="group-code"
                >
                  Invite Code
                </label>
                <input
                  type="text"
                  name="code"
                  onChange={handleChange}
                  value={formData.code}
                  id="group-code"
                  placeholder="Enter invite code..."
                  className="px-4 py-2 rounded-xl border border-gray-300 bg-[#F9FAFA]
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             transition-all shadow-sm"
                />
              </div>

            </form>
          </div>
        </div>

        {/* Members Section */}
        {!addUser ? (
          <div className="flex flex-col mx-3 py-2 mt-4 mb-4 rounded-xl">

            <div className="flex justify-between">
              <div className="flex font-medium pt-2 pb-1 mx-2">
                <UserGroupIcon className="w-6 h-6 mx-2 text-black" />
                <div className="text-xl">Add Members</div>
              </div>

              <MagnifyingGlassIcon
                onClick={() => setAddUser(true)}
                className="w-5 h-5 mt-1.5 mx-2 text-blue-500 cursor-pointer"
              />
            </div>

            <div>
              {NormalizedChattedUsers?.map((element) => (
                <UserItem
                  key={element._id}
                  user={element}
                  isSelected={isSelected(element._id)}
                  onAdd={handleAddMember}
                  onRemove={handleRemoveMember}
                  showActions
                  mode="select"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="h-screen flex bg-white rounded-xl m-3 mb-20 flex-col">

            <div className="flex p-2 mx-2 my-2 mt-6 bg-[#F9FAFA] border rounded-xl">
              <MagnifyingGlassIcon className="w-5 h-5 pt-1 text-gray-700" />
              <input
                type="search"
                className="w-full bg-[#F9FAFA] outline-none pl-2"
                onChange={onChangeSearchAddUser}
                placeholder="Search users"
              />
            </div>

            <div className="flex flex-col pb-10 overflow-y-auto">
              {searchingAddUser &&
                NormalizedDatabaseUsers?.map((element) => (
                  <UserItem
                    key={element._id}
                    user={element}
                    isSelected={isSelected(element._id)}
                    onAdd={handleAddMember}
                    onRemove={handleRemoveMember}
                    showActions
                    mode="select"
                  />
                ))}
            </div>
          </div>
        )}

        {/* Create Button */}
        <button
          disabled={!selectedUsers.length}
          onClick={handleCreateGroup}
          className={`mx-3 mb-20 py-3 px-4 rounded-2xl text-white flex justify-center items-center gap-2
            ${
              selectedUsers.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-[1.02]"
            }`}
        >
          <UserGroupIcon className="w-5 h-5" />
          Create Group
          <span>{selectedUsers.length}</span>
        </button>

      </div>
    </div>
  );
}