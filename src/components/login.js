import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

//include style Css file
import "../css/style.css";

function Login(props){
    const navigate = useNavigate();
    const appRef = useRef();
    useEffect(() => {
        let ctx = gsap.context(() => {
          // normal selector text, automatically scoped to appRef 
          gsap.to(".overlay", {
            duration: 2,
            delay: 1,
            top: "-100%",
            ease: "power3.inOut",
          });
          gsap.to(".overlay span", {
            duration: 2,
            delay: 0.3,
            opacity: 0,
            y: -60,
            ease: "power3.inOut",
          });
          gsap.to(".overlay h1", {
            duration: 2,
            opacity: 0,
            y: -60,
            ease: "power3.inOut",
          });
          gsap.from(".login", {
            duration: 1,
            delay: 3,
            opacity: 0,
            y: -100,
            ease: "power3.inOut",
          });
          gsap.from(".login-form", {
            duration: 1,
            delay: 3,
            opacity: 0,
            y: 200,
            ease: "power3.inOut",
          });
        }, appRef);
    
        return () => ctx.revert();
    }, []);

    // init services
    const db = getFirestore();
    const auth = getAuth();

    // collection refs
    const usersCollection = collection(db, "users");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPasswordValid, setisPasswordValid] = useState(true);
    const [authFailed, setauthFailed] = useState(false);

    

    function handleSubmit(e){
        e.preventDefault();
        setIsEmailValid(true);
        setisPasswordValid(true);
        setauthFailed(false);

        // Validate form basic
        if (!validateEmail(email) || !validatePassword(password)) {
          if(!validateEmail(email)){
            setIsEmailValid(false);
          }     
          if(!validatePassword(password)){
            setisPasswordValid(false);
          }
          
          return;
        }


        signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {

        const qEmail = query(usersCollection, where("email", "==", email));
        getDocs(qEmail)
        .then((querySnapshot) => {
            if (querySnapshot.size > 0) { // fetch all the info we'll need later
            const userType = querySnapshot.docs[0].data().userType;
            const firstname = querySnapshot.docs[0].data().name;
            const surname = querySnapshot.docs[0].data().surname;
            const email = querySnapshot.docs[0].data().email;

            const userInformation = { // collect all info (this variable is temp)
                email: email,
                userType: userType,
                firstname: firstname,
                surname: surname
            };


            props.loginCollect(userInformation); // save it in local storage


            if (userType === 'student') {
                navigate('/student-dashboard');
              } else if (userType === 'coordinator') {
                navigate('/coordinator-dashboard');
              } else if (userType === 'admin') {
                navigate('/admin-dashboard');
              } else {
                navigate('/career-dashboard');
              }
            

            } else {
            console.log("Some fetch required info were not found"); // if info was not found
            }
        })
        .catch((error) => {
            console.log("Error getting documents: ", error); // if fetching documents failed
        });
        
        })
        .catch((err) => {
        setauthFailed(true);
        console.log(err.message); // front-end to display incorrect login goes here
        });


    }

    // Email validation function
    function validateEmail(email) {
      // Regular expression to validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

     // Password validation function
    function validatePassword(password) {
      const passwordLength = 6;
      return password.length >= passwordLength;
    }


    return(
        <main ref={appRef}>
            <div className="overlay">
                <img src="images/Uskudar_Universitesi_logo.png" alt="" />
                <h1>Welcome to</h1>
                <span>Üsküdar University</span>
            </div>
        <div className="container text-center">
            <div className="row align-content-center">
                <div className="col-md-12">
                    <div className="login">
                        <a><img src="images/Uskudar_Universitesi_logo.png" alt="logo" /></a>
                        <h1>Üsküdar Login</h1>
                        <form className="login-form needs-validation" noValidate onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input type="email" name="email" className="form-control" id="studentID" aria-describedby="Student ID" placeholder="Email" required  onChange={(e) => setEmail(e.target.value)} />
                            {!isEmailValid && <div className="invalid-feedback">Enter a valid Email</div>}
                        </div>
                        <div className="mb-3">
                            <input type="password" name="password" className="form-control" id="Password" placeholder="Password" required  onChange={(e) => setPassword(e.target.value)} />
                            {!isPasswordValid && <div className="invalid-feedback">Enter a valid password</div>}
                            {authFailed && <div className="invalid-feedback">Incorrect email or password</div>}
                        </div>
                    
                        <button type="submit" className="send-btn">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </main>
    )

}

export default Login;