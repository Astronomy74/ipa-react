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
            const conversationObj = {
                id: conversationId,
                msg: conversation,
            }
            conversationList.push(conversationObj);
        });
        setConversations(conversationList);

    })
    .catch((error) => {
        console.log("Error getting documents: ", error); // if fetching documents failed
    });
    }, []);
       
    const renderConversations = conversations.map((entry, index) => {
        let participant;
        for(let i = 0; i < entry.msg.participants.length; i++){
            if(entry.msg.participants[i] !== props.userInfo.login.email){
                participant = entry.msg.participants[i];
            }
        }
        return(
            <div className="box" key={index}>
                <div className="box-title">
                    {/* <Link to={`/student-dashboard/stats/${box.title.replace(/\s/g, "-")}`}>
                        <span 
                        className="internshipLink"
                        data-json="data/internship.json"
                        >
                        {box.title}
                        </span>
                    </Link> */}
                    <span>{participant}</span>
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

