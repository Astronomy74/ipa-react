import React, { useState, useEffect, useRef } from "react";
import NavBar from "./navBar";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { Link } from 'react-router-dom';

//stats sCss
import '../sass/stas.scss'
import '../sass/inbox.scss'

function Messages(props){
    const [conversations, setConversations] = useState([]);
    const [unreadMessages, addUnreadMessages] = useState([]);
    const [fontWeight, setFontWeight] = useState("normal");

    useEffect(() => {
    const db = getFirestore();
    const conversationsCollection = collection(db, "conversations");
    const qConversations = query(conversationsCollection, where("participants", "array-contains", props.userInfo.login.email));

    getDocs(qConversations)
    .then((querySnapshot) => {
        const conversationList = [];
        querySnapshot.forEach((doc) => {
            const conversationId = doc.id;
            const conversation = doc.data();
            const lastactivity = doc.data().lastactivity;
            let conversationObj = {};
            conversationObj.id = conversationId;
            conversationObj.msg = conversation;
            conversationObj.lastactivity = lastactivity;

            const conversationData = doc.data();

            const msgData = Object.values(conversationData).find(obj => {
            const keys = Object.keys(obj);
            return (
                !keys.includes('lastactivity') &&
                !keys.includes('participants') &&
                !keys.includes('subject') &&
                obj !== conversationData.lastactivity &&
                obj !== conversationData.participants &&
                obj !== conversationData.subject
            );
            });

            
            if(msgData.receiver !== props.userInfo.login.email){
                let participant = {
                    email: msgData.receiver,
                    name: msgData.receiverFirstName,
                    surname: msgData.receiverSurname,
                }
                conversationObj.participant = participant;
            }else{
                let participant = {
                    email: msgData.sender,
                    name: msgData.senderFirstName,
                    surname: msgData.senderSurname,
                }
                conversationObj.participant = participant;
            }
            

            conversationList.push(conversationObj);
        });
        conversationList.sort((a, b) => b.lastactivity - a.lastactivity);
        setConversations(conversationList);

    })
    .catch((error) => {
        console.log("Error getting documents: ", error); // if fetching documents failed
    });
    }, []);

    async function fetchUnreadMessages() {
        try {
          const db = getFirestore();
          const conversationsRef = collection(db, 'conversations');
          
          // query to find document where participant is logged in user
          const q = query(conversationsRef, where('participants', 'array-contains', props.userInfo.login.email));
          const querySnapshot = await getDocs(q);
          
          querySnapshot.forEach((doc) => {
            const conversationData = doc.data();
            const conversationId = doc.id;
            
            // iterate through the map objects
            for (const messageId in conversationData) {
              const message = conversationData[messageId];
              
              if (message.isRead === false && message.receiver === props.userInfo.login.email) {
                // logic for if an unread message is found goes here
                addUnreadMessages(conversationId);
              }
            }
          });
          
        } catch (error) {
          console.error('Error fetching unread messages:', error);
          throw error;
        }
      }
      fetchUnreadMessages()


    let font = "normal"
      const renderConversations = conversations.map((entry, index) => {

        if(unreadMessages.includes(entry.id)){
            font = "bold";
        }
        else{
            font = "normal";
        }
        
        return(
            <div className="box" key={index}>
                <div className="box-title user">
                    {entry.participant && <span><div>{entry.participant.name} {entry.participant.surname}</div><div>{entry.participant.email}</div></span>}
                </div>
                <div className="box-title message">
                    <Link to={`/conversation/${entry.id}`}>
                        <span 
                        className="internshipLink" style={{ fontWeight: `${font}`, textDecoration: 'none' }}
                        >
                        {entry.msg.subject}
                        </span>
                    </Link>
                </div>
            </div>
        );
    });


  return(
      <main>
          <NavBar props={props}/>
          <div className="container text-center">
            <div className="row align-content-center">
                <div className="col-md-12">

                    <div className="login login-wrapper">
                        <div className="sidebar-wrapper">
                        <h1>Messages</h1>
                        <Link className="new-msg" to={`/conversation/new`}>
                            <button className="send-btn">
                                New Message
                            </button>
                        </Link>
                        </div>
                        <div className="content-wrapper">
                            <h1>Incomming Messages</h1>
                            {renderConversations}

                        </div>
                    </div>
                </div>
                
                  </div>
              </div>
      </main>
  );
}

export default Messages;

