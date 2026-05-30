import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function EmptyChat({mode}) {
  const content = {
  chat: {
    icon: "💬",
    title: "Start a Conversation",
    description: "Select a user from the list to start chatting.",
  },
  users: {
    icon: <MagnifyingGlassIcon className="w-10 h-10" />,
    title: "Find Someone to Chat",
    description:
      "Search for a user from the search bar and start a conversation.",
  },
  groups: {
    icon: <MagnifyingGlassIcon className="w-10  h-10" />,
    title: "Find a Group",
    description:
      "Create or join a group and start chatting with others.",
  },
};
const current = content[mode]
  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-50 shadow-xl rounded-2xl">
      <div className="text-center px-6">
        <div className="flex justify-center my-4">
          <div className="bg-blue-100 text-blue-600 p-5 rounded-full hover:scale-110">
        {current.icon}</div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
       {current.title}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {current.description}
        </p></div>
    </div>
  );
}