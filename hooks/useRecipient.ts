import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { getRecipientEmail } from "./../utils/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { AppUser, Conversation } from "../types";

export const useRecipient = (conversationUsers: Conversation["users"]) => {
  const [loggedInUser, _loading, _error] = useAuthState(auth);

  // Lấy email người nhận
  const recipientEmail = getRecipientEmail(conversationUsers, loggedInUser);

  // Lấy avatar người nhận
  const queryGetRecipient = query(
    collection(db, "users"),
    where("email", "==", recipientEmail)
  );
  const [recipientsSnapshot, __loading, __error] =
    useCollection(queryGetRecipient);

  // recipientsSnapshot?.docs có thể là một array rỗng, dẫn đến docs[0] không được xác định(undefined)
  // nên ta cần phải bắt buộc thêm "?" sau docs[0] bởi vì không có data() trong "undefined"
  const recipient = recipientsSnapshot?.docs[0]?.data() as AppUser | undefined;

  return {
    recipient,
    recipientEmail,
  };
};
