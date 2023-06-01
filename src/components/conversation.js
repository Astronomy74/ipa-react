import React, { useState, useEffect, useRef, useHistory } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "./navBar";
import UploadButton from "./uploadButton";
import download from "downloadjs";
import {
  ref,
  listAll,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { storage } from "./fireStorage";
import { Link, useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  query,
  setDoc,
  serverTimestamp,
  where,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

//stats sCss
// import "../sass/stas.scss";

function Conversation(props) {
  const lastItem = useLocation().pathname.split("/").pop();
  const navigate = useNavigate();

  const [Contact, setContact] = useState("");
  const [Subject, setSubject] = useState("");
  const [Message, setMessage] = useState("");
  const [Attachment, UploadedAttachment] = useState("");
  const [progress, setProgress] = useState(0);
  const [UpdateDetect, UpdateDetector] = useState(null);
  const [coordinatorInfo, setCoordinatorInfo] = useState("");
  const [StudentsInfo, setStudents] = useState([]);
  const [Recipient, getRecipient] = useState([]);
  const [NewMsgContact, setNewMsgContact] = useState("Contact");

  const db = getFirestore();
  const departmentRequired = props.userInfo.login.department;

  useEffect(() => {
    const getEmailFromFirestore = async () => {
      if (props.userInfo.login.userType === "student") {
        const q = query(
          collection(db, "users"),
          where("userType", "==", "coordinator"),
          where("department", "==", departmentRequired)
        );
        try {
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            const email = doc.data().email;
            const name = doc.data().name;
            const surname = doc.data().surname;
            const info = { email, name, surname };
            setCoordinatorInfo(info);
            setNewMsgContact(email);
          });
        } catch (error) {
          console.log("Error getting documents:", error);
        }
      } else {
        const q = query(
          collection(db, "users"),
          where("userType", "==", "student"),
          where("department", "==", departmentRequired)
        );
        try {
          const querySnapshot = await getDocs(q);
          let info = [];
          querySnapshot.forEach((doc) => {
            const email = doc.data().email;
            const name = doc.data().name;
            const surname = doc.data().surname;
            const userInfo = {
              email: email,
              name: name,
              surname: surname,
            };
            info.push(userInfo);
          });
          setStudents(info);
        } catch (error) {
          console.log("Error getting documents:", error);
        }
      }

      if (lastItem !== "new") {
        const conversationCollectionRef = collection(db, "conversations");
        const conversationDocRef = doc(conversationCollectionRef, lastItem);
        const querySnapshot = await getDoc(query(conversationDocRef));
        const conversationData = querySnapshot.data();

        const recepient = conversationData.participants.find(
          (email) => email !== props.userInfo.login.email
        );

        // notification handling
        if (conversationData) {
          // iterate over the nested map objects within conversationData
          for (const [messageId, message] of Object.entries(conversationData)) {
            // check if the message is an object and has the isRead field
            if (
              typeof message === "object" &&
              message.hasOwnProperty("isRead")
            ) {
              // update the isRead field to true
              conversationData[messageId].isRead = true;
            }
          }
          // update the document with the modified conversationData
          await setDoc(conversationDocRef, conversationData);
        }

        getRecipient(recepient);
      }
    };
    getEmailFromFirestore();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const timestamp = new Date(); // Get current timestamp
    const formattedDate = timestamp.toISOString(); // Format timestamp as a string

    ///////////// Handle Message Submit /////////////

    const submitMessage = async (
      folderName,
      attachmentLink,
      attachmentName
    ) => {
      const messageData = {
        // this is the structure I'm using, a map type field in the database
        timestamp: serverTimestamp(), // firebase timestamp function
        isRead: false, // for notifications later
        message: Message, // gets Message from the form box
        attachmentName: attachmentName || "",
        attachmentLink: attachmentLink || "",
        sender: props.userInfo.login.email,
        senderFirstName: props.userInfo.login.firstname,
        senderSurname: props.userInfo.login.surname,
      };

      try {
        const conversationCollectionRef = collection(db, "conversations");
        // every entry will have participants, so we can fetch correctly
        let Participants;
        if (props.userInfo.login.userType === "student") {
          Participants = [props.userInfo.login.email, coordinatorInfo.email];
          messageData.receiver = coordinatorInfo.email;
          messageData.receiverFirstName = coordinatorInfo.name;
          messageData.receiverSurname = coordinatorInfo.surname;
        } else {
          if (lastItem === "new") {
            Participants = [props.userInfo.login.email, Contact.email];
            messageData.receiver = Contact.email;
            messageData.receiverFirstName = Contact.name;
            messageData.receiverSurname = Contact.surname;
          } else {
            const usersCollection = collection(db, "users");
            const qEmail = query(
              usersCollection,
              where("email", "==", Recipient)
            );
            getDocs(qEmail)
              .then((querySnapshot) => {
                if (querySnapshot.size > 0) {
                  // fetch all the info we'll need later
                  const firstname = querySnapshot.docs[0].data().name;
                  const surname = querySnapshot.docs[0].data().surname;
                  const email = querySnapshot.docs[0].data().email;

                  Participants = [props.userInfo.login.email, email];
                  messageData.receiver = email;
                  messageData.receiverFirstName = firstname;
                  messageData.receiverSurname = surname;
                }
              })
              .catch((error) => {
                console.log("Error getting documents: ", error); // if fetching documents failed
              });
          }
        }

        // If it's a new message
        if (lastItem === "new") {
          // if it's a new message that has an attachment we use foldername to match ids
          if (folderName) {
            const conversationDocRef = doc(
              conversationCollectionRef,
              folderName
            );
            await setDoc(conversationDocRef, {
              subject: Subject,
              [formattedDate]: messageData,
              participants: Participants,
              lastactivity: serverTimestamp(),
            });
          } else {
            // if it's a new message that doesn't have an attachment we create a new id
            await addDoc(conversationCollectionRef, {
              subject: Subject,
              [formattedDate]: messageData,
              participants: Participants,
              lastactivity: serverTimestamp(),
            });
          }
          navigate("/messages");
        } else {
          // if it's not a new message
          const conversationDocRef = doc(conversationCollectionRef, lastItem);
          const querySnapshot = await getDoc(query(conversationDocRef));
          const conversationData = querySnapshot.data();

          const updatedConversationData = {
            ...conversationData, // retrieve the items in the conversation
            [formattedDate]: messageData, // and here it adds to the properties
            lastactivity: serverTimestamp(),
          };

          await setDoc(conversationDocRef, updatedConversationData);
        }

        console.log("message submitted successfully.");

        // clear form inputs
        setSubject("");
        setMessage("");
        UpdateDetector("");
      } catch (error) {
        console.error("error submitting message:", error);
      }
    };

    // Handle Attachment

    let folderName = "";
    let uploadFolderRef = "";

    if (Attachment) {
      try {
        const extention = Attachment.name.split(".").pop().toLowerCase();

        if (lastItem === "new") {
          // Generate an automatic ID for the folder
          const newConversationRef = await addDoc(
            collection(db, "conversations"),
            {}
          );
          // Get the newly generated document ID
          const newConversationId = newConversationRef.id;
          // Construct the storage reference using the new document ID and formattedDate
          uploadFolderRef = ref(
            storage,
            `conversations/${newConversationId}/${formattedDate}.${extention}`
          );
          folderName = newConversationId;
        } else {
          const storageRef = ref(storage, `conversations/`);
          const res = await listAll(storageRef);
          const existingFolder = res.prefixes.find(
            (prefix) => prefix.name === lastItem
          );

          if (existingFolder) {
            // Folder with the same name already exists, save inside the existing folder
            uploadFolderRef = ref(
              storage,
              `${existingFolder.fullPath}/${formattedDate}.${extention}`
            );
          } else {
            // Folder with the same name doesn't exist, create a new folder
            uploadFolderRef = ref(
              storage,
              `conversations/${lastItem}/${formattedDate}.${extention}`
            );
          }
        }

        const uploadTask = uploadBytesResumable(uploadFolderRef, Attachment);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const prog = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(prog);
          },
          (error) => console.log(error),
          () => {
            UploadedAttachment("");
            // Get the download URL of the uploaded file
            const newRef = uploadFolderRef._location.path;
            const uploadedFileRef = ref(storage, newRef);
            getDownloadURL(uploadedFileRef).then((url) => {
              let downloadURL = url;
              let attachmentName = Attachment.name;
              // Proceed with message submission or any other action here
              submitMessage(folderName, downloadURL, attachmentName);
            });
          }
        );
      } catch (error) {
        // Handle error
        console.error("Error handling attachment:", error);
      }
    } else {
      // No attachment
      submitMessage("");
    }
  };

  ////////// Handle Message Submit /////////

  function GetAttachment(file) {
    UploadedAttachment(file);
  }

  const [conversation, setConversation] = useState([]);
  const [displaySubject, setDisplaySubject] = useState();

  useEffect(() => {
    if (lastItem !== "new") {
      const db = getFirestore();
      const conversationsCollection = collection(db, "conversations");
      const conversationDocRef = doc(conversationsCollection, lastItem);
      getDoc(conversationDocRef)
        .then((querySnapshot) => {
          const conversationsCollect = querySnapshot.data();
          const filteredConv = [];
          Object.keys(conversationsCollect).forEach((key) => {
            const value = conversationsCollect[key];
            if (key === "subject") {
              setDisplaySubject(value);
            }
            if (
              key !== "participants" &&
              key !== "subject" &&
              key !== "lastactivity"
            ) {
              filteredConv.push(value);
            }
          });
          UpdateDetector(null);
          setConversation(filteredConv);
        })
        .catch((error) => {
          console.log("Error getting documents: ", error); // if fetching documents failed
        });
    }
  }, [UpdateDetect]);

  if (conversation) {
    const renderConversations = conversation
      .sort((a, b) => a.timestamp.toDate() - b.timestamp.toDate()) // Sort by timestamp
      .map((entry) => {
        const msgDate = entry.timestamp.toDate();
        const formattedDate = msgDate.toLocaleDateString(); // Format the date
        const formattedTime = msgDate.toLocaleTimeString(); // Format the time

        function downloadFile(event) {
          event.preventDefault();

          let anchor = event.target;

          let url = anchor.getAttribute("href");

          const xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.onload = function (event) {
            const blob = xhr.response;
            const blobUrl = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = anchor.getAttribute("download");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            window.URL.revokeObjectURL(blobUrl);
          };
          xhr.open("GET", url);
          xhr.send();
        }

        return (
          <div className="box" key={msgDate}>
            <div className="box-title">
              {/* <Link to={`/student-dashboard/stats/${box.title.replace(/\s/g, "-")}`}>
                            <span 
                            className="internshipLink"
                            data-json="data/internship.json"
                            >
                            {box.title}
                            </span>
                        </Link> */}
              <span>
                {entry.sender} {entry.senderFirstName} {entry.senderSurname} at{" "}
              </span>
              <span>
                {formattedTime}, {formattedDate}
              </span>
              <div>
                <div>Message: {entry.message}</div>
                <div>
                  <a
                    href={entry.attachmentLink}
                    download={entry.attachmentName}
                    onClick={downloadFile}
                  >
                    {entry.attachmentName}
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      });

    return (
      <main>
        <NavBar props={props} />
        <div className="container text-center">
          <div className="row align-content-center">
            <div className="col-md-12">
              <div className="login">
                <h1>Message</h1>

                <form
                  className="login-form needs-validation"
                  noValidate
                  onSubmit={handleSubmit}
                >
                  {lastItem !== "new" ? (
                    <h2>
                      Reply
                      <select
                        aria-label="Default select example"
                        name="contactType"
                        className="form-control"
                        required
                      >
                        <option value="">{Recipient}</option>
                      </select>
                      <span>Subject: {displaySubject}</span>
                    </h2>
                  ) : (
                    <h2>
                      Send To
                      <select
                        aria-label="Default select example"
                        name="contactType"
                        className="form-control"
                        onChange={(e) =>
                          setContact(
                            JSON.parse(
                              e.target.options[e.target.selectedIndex].value
                            )
                          )
                        }
                        required
                      >
                        <option value="">{NewMsgContact}</option>
                        {StudentsInfo.map((student, index) => (
                          <option
                            key={index}
                            value={JSON.stringify({
                              email: student.email,
                              name: student.name,
                              surname: student.surname,
                            })}
                          >
                            {student.email}
                          </option>
                        ))}
                      </select>
                    </h2>
                  )}

                  {/* <h2>To: {coordinatorInfo.name} {coordinatorInfo.surname}</h2> */}
                  {renderConversations}
                  {lastItem === "new" ? (
                    <div className="mb-3">
                      <span>Enter subject:</span>
                      <input
                        type="text"
                        name="subject"
                        className="form-control"
                        id="subject"
                        aria-describedby="Subject"
                        placeholder="Subject"
                        required
                        value={Subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <div className="mb-3">
                    <span>Enter reply:</span>
                    <textarea
                      type="text"
                      name="message"
                      className="form-control"
                      id="message"
                      placeholder="Message"
                      required
                      value={Message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  {/* Your other JSX code */}
                  <div className="btns">
                    <UploadButton
                      passedClass={"statsBtn"}
                      buttonText={"Upload Attachment"}
                      filePass={GetAttachment}
                    />
                    {Attachment && <span>{Attachment.name}</span>}
                    <button type="submit" className="send-btn">
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default Conversation;

