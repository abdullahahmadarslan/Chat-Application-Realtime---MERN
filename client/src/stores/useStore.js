import create from "zustand";

// Create the Zustand store
const useStore = create((set) => ({
  // Contacts
  selectedContact: null,
  setSelectedContact: (update) =>
    set((state) => {
      const newSelectedContact =
        typeof update === "function" ? update(state.selectedContact) : update;
      return { selectedContact: newSelectedContact };
    }),

  // Contacts array which are friends of the current logged-in user
  contactsArray: [],
  setContactsArray: (update) =>
    set((state) => {
      const newContactsArray =
        typeof update === "function" ? update(state.contactsArray) : update;
      return { contactsArray: newContactsArray };
    }),

  // Get all users from the database except the logged-in user
  allUsers: [],
  setAllUsers: (update) =>
    set((state) => {
      const newAllUsers =
        typeof update === "function" ? update(state.allUsers) : update;
      return { allUsers: newAllUsers };
    }),

  // Messages array for selected group or contact
  messages: [],
  setMessages: (update) =>
    set((state) => {
      const newMessages =
        typeof update === "function" ? update(state.messages) : update;
      return { messages: newMessages };
    }),

  // Groups
  selectedGroup: null,
  setSelectedGroup: (update) =>
    set((state) => {
      const newSelectedGroup =
        typeof update === "function" ? update(state.selectedGroup) : update;
      return { selectedGroup: newSelectedGroup };
    }),

  // Groups array for sidebar
  groupsArray: [],
  setGroupsArray: (update) =>
    set((state) => {
      const newGroupsArray =
        typeof update === "function" ? update(state.groupsArray) : update;
      return { groupsArray: newGroupsArray };
    }),

  // IDs of requests to be sent
  toSentRequestIds: [],
  setToSentRequestIds: (update) =>
    set((state) => {
      const newToSentRequestIds =
        typeof update === "function" ? update(state.toSentRequestIds) : update;
      return { toSentRequestIds: newToSentRequestIds };
    }),

  // Pending friend requests of the logged-in user
  pendingRequests: [],
  setPendingRequests: (update) =>
    set((state) => {
      const newPendingRequests =
        typeof update === "function" ? update(state.pendingRequests) : update;
      return { pendingRequests: newPendingRequests };
    }),

  // Group name and participants
  groupName: "",
  setGroupName: (update) =>
    set((state) => {
      const newGroupName =
        typeof update === "function" ? update(state.groupName) : update;
      return { groupName: newGroupName };
    }),

  participants: [],
  setParticipants: (update) =>
    set((state) => {
      const newParticipants =
        typeof update === "function" ? update(state.participants) : update;
      return { participants: newParticipants };
    }),

  // Current group members
  currentGroupMembers: [],
  setCurrentGroupMembers: (update) =>
    set((state) => {
      const newCurrentGroupMembers =
        typeof update === "function"
          ? update(state.currentGroupMembers)
          : update;
      return { currentGroupMembers: newCurrentGroupMembers };
    }),
}));

export default useStore;
