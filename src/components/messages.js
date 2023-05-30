import React, { useState, useEffect, useRef } from "react";
import NavBar from "./navBar";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { Link } from 'react-router-dom';

//stats sCss
import '../sass/stas.scss'


function Messages(props){
    const [conversations, setConversations] = useState([]);

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

    const renderConversations = conversations.map((entry, index) => {
        
        return(
            <div className="box" key={index}>
                <div className="box-title">
                    {entry.participant && <span>{entry.participant.email} {entry.participant.name} {entry.participant.surname}</span>}
                </div>
                <div className="box-title">
                    <Link to={`/conversation/${entry.id}`}>
                        <span 
                        className="internshipLink"
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
                    <div className="login">
                        <h1>Messages</h1>
                        <Link className="new-msg" to={`/conversation/new`}>
                            <button className="send-btn">
                                New Message
                            </button>
                        </Link>
                        {renderConversations}
                        </div>
                        </div>
                
                  </div>
              </div>
      </main>
  );
}

export default Messages;

