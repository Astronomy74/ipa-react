import React, { useState, useEffect } from "react";
import NavBar from "./navBar";
import { getFirestore, collection, updateDoc, getDocs, query, orderBy, addDoc, doc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { storage } from "./fireStorage";
import { ref, uploadBytes, getDownloadURL} from "firebase/storage";

function AnnounceJobs(props){

    const db = getFirestore();

    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [languages, setLanguages] = useState("");
    const [title, setJobtitle] = useState("");
    const [duration, setDuration] = useState("");
    const [paid, setPaid] = useState("");
    const [email, setEmail] = useState("");
    const [skills, setSkills] = useState("");
    const [googleMaps, setMaps] = useState("");
    const [file, setFile] = useState(null);
    const [ReRender, setReRender] = useState(null);

    function extractLinkFromIframe(iframeCode) {
        const regex = /src="([^"]+)"/i;
        const match = regex.exec(iframeCode);
        if (match && match.length >= 2) {
          const src = match[1];
          return decodeURIComponent(src);
        }
        return null;
      }


    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
      };

    const handleSubmit = async (event) => {
        event.preventDefault();
         
        const maps = extractLinkFromIframe(googleMaps)
        const timestamp = serverTimestamp();
        const jobData = {description, paid, location, languages, title, duration, email, skills, maps, timestamp}
        const docRef = await addDoc(collection(db, "jobOffers"), jobData);
        console.log("Document added with ID: ", docRef.id);

        if (file) {
            const storagePath = `logos/${file.name}`;
            const storageReference = ref(storage, storagePath);
            await uploadBytes(storageReference, file);
            console.log("File uploaded successfully.");

            const downloadURL = await getDownloadURL(storageReference);
            await updateDoc(doc(db, "jobOffers", docRef.id), {
                logo: downloadURL,
                });
            console.log("Download URL stored in Firestore.");
            const fileInput = document.getElementById("fileInput");
            if (fileInput) {
                fileInput.value = ""; 
            }
            }

        // addDoc(collection(db, "jobOffers"), 
        // { description, paid, location, languages, jobtitle, duration, contactEmail, skills })
        // .then((docRef) => {
        // console.log("Document added with ID: ", docRef.id);
        // })
        // .catch((error) => {
        // console.error("Error adding document: ", error);
        // });
        event.target.reset();
        setDescription("");
        setLocation("");
        setLanguages("");
        setJobtitle("");
        setDuration("");
        setPaid("");
        setEmail("");
        setSkills("");
        setMaps("");
        setFile(null);
        setReRender("");
             
        
    }
        // get reference to jobOffers collection
        const jobOffersRef = collection(db, 'jobOffers');
        const [docsArray, setdocsArray] = useState([]);
        useEffect(() => {
            setReRender(null);
            // loop through all documents in the collection
            const qJobs = query(jobOffersRef, orderBy("timestamp", "desc"));
            getDocs(qJobs).then((querySnapshot) => {
              let TempList = [];
              querySnapshot.forEach((doc, index) => {
                const description = doc.data().description;
                const docId = doc.id;
                let docObj = {
                  description: description,
                  id: docId,
                };
                TempList.push(docObj);
              });
              setdocsArray(TempList);
            });
          }, [ReRender]);
    
        const [seeAll, seeAllToggle] = useState('');
        const [seeHide, SeeHideToggle] = useState("See All Job Offers")

        function deleteJobOffer(docId) {
            deleteDoc(doc(db, "jobOffers", docId))
            .then(() => {
            console.log("Document successfully deleted!");
            setReRender("");
            })
            .catch((error) => {
            console.error("Error removing document: ", error);
            });
        }
        
        if(docsArray){
            const renderjobs = docsArray.map((doc) => {
                return (
                    <div className="box-request" key={doc.id}>
                    <h2 id="jobOffer1">
                        {doc.description}
                    </h2>
                    <button onClick={() => deleteJobOffer(doc.id)}>Delete</button>
                    </div>
                    
                );
            });
    
            function seeAllToggler(){
                if(!seeAll){
                    seeAllToggle(true);
                    SeeHideToggle("Hide Job Offers")
                }else {
                    seeAllToggle(false);
                    SeeHideToggle("See All Job Offers")
                }
            }

return(
    <main>
    <NavBar props={props} NavLocation={'jobs'}/>
    <section>
        <h1>delete me</h1>
        <h1>delete me</h1>
        <h1>delete me</h1>
    </section>
    <section
            className="EnterJobInfo-instructor"
            id="EnterJobInfoInstructor"
        >
            <form id="jobAnnounceForm" onSubmit={handleSubmit}>
            <div className="job-info">
                <div className="container text-center">
                    <div className="row">
                        <h2>Add a Job Offer</h2>
                        <div className="col-md-6">
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="description"
                                    name="company-name"
                                    placeholder="Job Description"
                                    onChange={(e) => setDescription(e.target.value)} 
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    placeholder="Location"
                                    onChange={(e) => setLocation(e.target.value)} 
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    id="languages"
                                    name="minimum-age"
                                    placeholder="Required Language(s)"
                                    onChange={(e) => setLanguages(e.target.value)} 
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder="Job Title"
                                    onChange={(e) => setJobtitle(e.target.value)} 
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    id="duration"
                                    name="duration"
                                    placeholder="Duration"
                                    onChange={(e) => setDuration(e.target.value)} 
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="paid"
                                    name="paid"
                                    placeholder="Salary (if job is paid)"
                                    onChange={(e) => setPaid(e.target.value)} 
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder="Contact Email"
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="skills"
                                    name="skills"
                                    placeholder="Required Skills"
                                    onChange={(e) => setSkills(e.target.value)} 
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    id="googleMaps"
                                    name="googleMaps"
                                    placeholder='Google Maps (press "Share", then "Embed a map" then "Copy HTML")'
                                    onChange={(e) => setMaps(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept=".png"
                                    onChange={handleFileChange}
                                    required
                                />
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            <button type="submit" className="btn sub" id="announce">Announce</button>
            </form>
        </section>
        <section className="applyforjob" id="applyForJob">
                    <div className="container text-center">
                    <div className="row">
                        <div className="col-12">
                        <h1>Delete Job Offers</h1>
                        <div className={"boxs-request " + (seeAll? 'active' : '')} id="boxsRequest">
                            {renderjobs}
                        </div>
                        </div>
                        <span className="btn sub" id="seeAll" onClick={seeAllToggler}>{seeHide}</span>
                    </div>
                    </div>
                </section>
    </main>
    );
}
}

export default AnnounceJobs;