  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCRnFC9SRJaWK4O6UX5r8phB0ScFJK-tVc",
    authDomain: "test-5838a.firebaseapp.com",
    projectId: "test-5838a",
    storageBucket: "test-5838a.appspot.com",
    messagingSenderId: "583006687436",
    appId: "1:583006687436:web:fffc927fa6a57385e23269"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

const app = firebase.app();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const db = firebase.firestore();

var unsubscribe;
var btn = document.getElementById('buton');
var create = document.getElementById('create');
var lobtn = document.getElementById('lobuton');
var img = document.getElementById('img');
var url = location.hash.substr(1);
var imgurl;
var cntcomments = 0;
var username = "";
var ok = false;
url = url.split('/');
var copyurl = url[1];
var copyurl2 = url[0];
btn.onclick = () => auth.signInWithPopup(provider);
lobtn.onclick = () => auth.signOut();

auth.onAuthStateChanged((user) => {
    url = location.hash.substr(1);
    url = url.split('/');
    copyurl = url[1];
    
  if (user) {
    if(user.displayName == "Iustin Constantin"){
      create.hidden = false;
    }
    var uid = user.uid;
    lobtn.hidden = false;
    img.hidden = false;
    btn.hidden = true;
    img.src = user.photoURL;
    imgurl = user.photoURL;
    username = user.displayName;
    if(url[0] == "post"){
      document.getElementById("comment-area").hidden = false;
      document.getElementById("non-comment").hidden = true;
      db.collection("comments").get().then(function (querySnapshot) {
      cntcomments = 0;
      querySnapshot.docs.map((doc) => {
        if (doc.data().url == url[1])
          cntcomments++;
      })
      document.getElementById("comment-number").innerHTML = cntcomments + " Comments";
    });
  }
  } else {
    lobtn.hidden = true;
    btn.hidden = false;
    img.hidden = true;
    if(url[0] == "post"){
      document.getElementById("comment-area").hidden = true;
      document.getElementById("non-comment").hidden = false;
    }
  }
});

function loadContent() {
  var ok1 = true; 
  var url = location.hash.substr(1);
  url = url.split('/');;
  if(copyurl != url[1] )
    window.location.reload(), copyurl = url[1];
  if(url[0] == "create"){
      document.getElementById("main").innerHTML = `<div class = "container" style = "min-height: 600px ">
      <label for="titlu" class  = "mt-5">Title : </label>
      <input type="text" class="form-control" id="titlu">
      <label for="article" class  = "mt-4">Article : </label>
      <span contenteditable="true" id = "article"  style="overflow:hidden" class="form-control " aria-label="With textarea" role="textbox"></span>
      <label for="formfile" class="form-label mt-4" id = "progres">Image</label>
      <input class="form-control" type="file" id="formfile">
      <button class= "btn btn-outline-dark  d-flex justify-content-center mx-auto text-center mt-3" id = "postpost">POST</button>
    </div>`;
    var postpost = document.getElementById("postpost");
    var formfile = document.getElementById("formfile");
    formfile.addEventListener("change", function(e){
        var file = e.target.files[0];
        var storageRef = firebase.storage().ref(file.name);
        var x = storageRef.put(file);
        var imageurl = "";
        x.on(firebase.storage.TaskEvent.STATE_CHANGED,
              (snapshot) => {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                document.getElementById("progres").innerHTML = "Loding is " + parseInt(progress) + "% complete!";
                switch (snapshot.state) {
                  case firebase.storage.TaskState.PAUSED: // or 'paused'
                    ;
                    break;
                  case firebase.storage.TaskState.RUNNING: // or 'running'
                  document.getElementById("postpost").className = "btn btn-outline-dark  d-flex justify-content-center mx-auto text-center mt-3 disabled";
                    break;
                }
              }, 
              (error) => {
                switch (error.code) {
                  case 'storage/unauthorized':
                    break;
                  case 'storage/canceled':
                    break;
                  case 'storage/unknown':
                    break;
                }
              }, 
              () => {
                x.snapshot.ref.getDownloadURL().then((downloadURL) => {
                  imageurl = downloadURL;
                });
                document.getElementById("postpost").className = "btn btn-outline-dark  d-flex justify-content-center mx-auto text-center mt-3";
                postpost.onclick = () => {
                  var titlu = document.getElementById("titlu").value;
                  var articol = document.getElementById("article").innerText;
                  document.getElementById("titlu").value  = "";
                  document.getElementById("article").innerText = "";
                  document.getElementById("progres").innerHTML = "Image";
                  const { serverTimestamp } = firebase.firestore.FieldValue;
                  db.collection('post').add({
                    title : titlu,
                    article : articol,
                    img : imageurl,
                    createdAt: serverTimestamp()
                  }).then(() => {
                    window.location.reload()
                  });

                  
                };
                
              }
              )
            });
    

  }
  else
    if (url[0] == "post") {
    db.collection("comments").get().then(function (querySnapshot) {
      cntcomments = 0;
      querySnapshot.docs.map((doc) => {
        if (doc.data().url == url[1])
          cntcomments++;
      })
      document.getElementById("comment-number").innerHTML = cntcomments + " Comments";
    });
    document.getElementById("main").innerHTML = `
        <div class = "container-fluid ">
            <div class = "container d-flex justify-content-center ">
              <img id = "img1" class="img-fluid w-50 h-50 mt-5 mx-5" src="" alt="">
            </div>
            <div class ="container">
              <div class = "col col-4 offset-5">
                <h2 id = "title">Title</h2>
              </div>
              <p class="text-break" id = "art"></p>
            </div>
        </div>
        <div class="row" >
          <div class ="col-lg-9 col-12 order-lg-1 order-2" id = "non-comment" hidden = "true">
          <div class = "row">
            <div class = "float-start mt-2">
              <h5>Login for comments!</h5>
            </div>
            </div>
            <hr>
          </div>
          <div class ="col-lg-9 col-12 order-lg-1 order-2" id = "comment-area" hidden = "true">
              <div class = "row">
                  <div class = "float-start mt-2">
                      <h5  id = "comment-number">Comments : ${cntcomments}</h5>
                  </div>
              </div>
              <hr>
              
              <div class="row" >
                  <div class ="col-md-1 col-2">
                      <img src ="" id = "imgc" class = "img-fluid rounded-circle float-end" width="75%" height="75%">
                  </div>
                  <div class = "col-md-11 col-10">
                      <span contenteditable="true" id = "postarea"  style="overflow:hidden" class="form-control" aria-label="With textarea" role="textbox"></span>
                      <button class = "btn btn-primary float-end" id = "post">POST</button>
                  </div>
              </div>
              <div class = "row" id = "comment-container">
              </div>
          </div>
          <div class ="col-lg-3 col-12 order-lg-2 order-1  d-flex justify-content-center" >
            <div class = "container"> 
              <div class = "row">
                <div class = "float-start mt-2">
                  <h5>Other blogs :</h5>
                </div>
              </div>
               <hr>
              <div class = "row">
                <ul id = "other-blogs" style="list-style: none;" class = "list-inline mx-auto justify-content-center"> 
                </ul>
             </div>
             </div>
          </div>    
      </div>`;
    

    auth.onAuthStateChanged((user) => {
      if (user) {
        document.getElementById("comment-area").hidden = false;
        document.getElementById("non-comment").hidden = true;
        var post = document.getElementById('post');
        document.getElementById("imgc").src = user.photoURL;
        post.onclick = () => {
          var text = document.getElementById('postarea').innerText;
          document.getElementById('postarea').innerText = "";
          const { serverTimestamp } = firebase.firestore.FieldValue;
          db.collection('comments').add({
            name: user.displayName,
            comment: text,
            createdAt: serverTimestamp(),
            idiv: 0,
            img: user.photoURL,
            url: url[1],
          })
          db.collection("comments").get().then(function (querySnapshot) {
            cntcomments = 0;
            querySnapshot.docs.map((doc) => {
              if (doc.data().url == url[1])
                cntcomments++;
            })
            document.getElementById("comment-number").innerHTML = cntcomments + " Comments";
          });

        }

        unsubscribe = db.collection('comments')
          .orderBy('createdAt', 'desc')
          .onSnapshot(querySnapshot => {
            const items = querySnapshot.docs.map(doc => {
              var cntreply = 0;
              var idiv = doc.id = "idiv";

              if (doc.data().url == url[1] && doc.data().name == user.displayName && doc.data().idiv == 0) {
                return `
                    <ul>
                    <li>
                    <div  class = "container-fluid" id = "${doc.id}" onmouseout="Afis(id)" onmouseover="Afis(id)">
                        <div class = "row">
                            <div class = "row">
                                <div class = "row ">
                                    <span class="badge bg-outline-light text-dark col-1 offset-1">${doc.data().name}</span>
                                </div>
                                <div class = "col-md-1 col-3">
                                    <img src="${doc.data().img}" class = "img-fluid rounded-circle float-end w-75">
                                </div>
                                <div class = "col-md-10 col-7">
                                    <span contenteditable="false" id = "${doc.id + "txt"}"   class="form-control text-break" aria-label="With textarea" role="textbox"> ${doc.data().comment}</span>
                                </div>
                                <div class = "col-1">
                                    <div class="dropdown">
                                        <button hidden = "true" class="btn btn-outline-lightdropdown" type="button" id="${doc.id + "set"}" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="fa fa-ellipsis-v"></i>
                                        </button>
                                        <ul class="dropdown-menu" aria-labelledby="set">
                                            <button id = "${doc.id}" class="dropdown-item" onclick = "Edit(id)" >Edit</button>
                                            <button id = "${doc.id}" class="dropdown-item" onclick = "Delete(id)">Delete</button>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                                <div class = "container">
                                    <button hidden = "true" id = "${doc.id + "cancel"}" class = "btn btn-secondary btn-sm col-lg-1 offset-lg-8 col-4 offset-3" text-break>CANCEL</button>
                                    <button hidden = "true" id = "${doc.id + "save"}" class = "btn btn-primary btn-sm  col-lg-1 col-3">SAVE</button>
                                </div>
                                <div class = "container">
                                <input  type="submit" id = "${doc.id}" name = "${doc.id + "show"}" style = "border:none;" value = "Show reply" class = "btn btn-outline-light btn-sm col-md-2 offset-4 text-primary"text-break onclick="Show(id)">
                                </div>
                                <div hidden = "true"  class = "container" id = "${doc.id + "idiv"}">
                                    <div hidden = "true" class="row" id = "${doc.id + "list2"}">
                                        <div class="input-group">
                                            <div class="col-6 offset-3">
                                                <span contenteditable="true" id = "${doc.id + "replytxt"}"   class="form-control text-break" aria-label="With textarea" role="textbox"></span>
                                            </div>
                                            <div class="col-3">
                                                <button class="btn btn-outline-secondary input-group-text" id = "${doc.id + "reply"}">POST</button>
                                            </div> 
                                        </div>
                                    </div>
                                    <ul  hidden = "true" class = "list-group" id = "${doc.id + "list"}">
                                    </ul>
                                <div>
                        </div>
                    </div>
                    </li>
                  </ul>
                  </br>`;
              }
              else
                if (doc.data().url == url[1] && doc.data().idiv == 0) {
                  return `
                        <ul>
                        <li>
                        <div  class = "container-fluid" id = "${doc.id}">
                            <div class = "row">
                                <div class = "row ">
                                    <span class="badge bg-outline-light text-dark col-1 offset-1">${doc.data().name}</span>
                                </div>
                                <div class = "row">
                                    <div class = "col-md-1 col-3">
                                        <img src="${doc.data().img}" class = "img-fluid rounded-circle float-end w-75">
                                    </div>
                                    <div class = "col-md-10 col-7">
                                        <span contenteditable="false" id = "${doc.id + "txt"}"   class="form-control text-break" aria-label="With textarea" role="textbox"> ${doc.data().comment}</span>
                                    </div>
                                </div>
                                <div class = "container">
                                    <input type="submit" id = "${doc.id}" name = "${doc.id + "show"}" style = "border:none;" value = "Show reply" class = "btn btn-outline-light btn-sm col-md-2 offset-md-4 offset-2 text-primary"text-break onclick="Show(id)">
                                    <button  id = "${doc.id}" style = "border:none;" class = "btn btn-outline-secondary btn-sm col-md-1 offset-md-4 offset-1" text-break onclick = "Reply(id)">REPLY</button>
                                </div>
                                <div hidden = "true"  class = "container" id = "${doc.id + "idiv"}">
                                    <div hidden = "true" class="row" id = "${doc.id + "list2"}">
                                        <div class="input-group">
                                            <div class="col-6 offset-3">
                                                <span contenteditable="true" id = "${doc.id + "replytxt"}"   class="form-control text-break" aria-label="With textarea" role="textbox"></span>
                                            </div>
                                            <div class="col-1">
                                                <button class="btn btn-outline-secondary input-group-text" id = "${doc.id + "reply"}">POST</button>
                                            </div> 
                                        </div>
                                    </div>
                                    <ul  hidden = "true" class = "list-group" id = "${doc.id + "list"}">
                                    </ul>
                                </div>
                            </div>
                        </div>
                        </li>
                        </ul>
                        </br>`;
                }
            });
            document.getElementById("comment-container").innerHTML = items.join('');
          });
      }
      else{
        document.getElementById("comment-area").hidden = true;
        document.getElementById("non-comment").hidden = false;
      }
    })
    db.collection('post').doc(url[1]).get().then(doc => {
      document.getElementById("img1").src = doc.data().img;
      document.getElementById("art").innerHTML = doc.data().article;
      document.getElementById("title").innerHTML = doc.data().title;
    });
    unsubscribe = db.collection('post')
    .orderBy('createdAt', 'desc').limit(10)
      .onSnapshot(querySnapshot => {
        const items = querySnapshot.docs.map(doc => {
          if (doc.id != url[1]) {
            var sz = parseInt( doc.data().article.length);
            var minim = Math.min(60, sz);
            var string = doc.data().article.slice(0, minim);
            return `<li class="list-inline-item">
                <div class = "container mt-3">
                  <div class="card d-flex justify-content-center mx-auto text-center bg-light " style = " border-radius: 5%;">
                    <img  id = "img1"  class = "img-fluid card-img-top" src="${doc.data().img}" style = "background: 50% 50% no-repeat; /* 50% 50% centers image in div */
                    object-fit: cover;height: 230px;">
                      <div class="card-body">
                        <h5 class="card-title">${doc.data().title}</h5>
                        <p class="card-text text-break">${string}...</p>
                        <a href="#post/${doc.id}" class="btn btn-outline-dark">View blog page</a>
                      </div>
                  </div>
                </div>
                </li>`;
          }

        });
        document.getElementById("other-blogs").innerHTML = items.join(``);
      });

  }
  else {
    document.getElementById("main").innerHTML = "";
    auth.onAuthStateChanged((user) => {
      db.collection('post')
      .orderBy('createdAt', 'desc')
        .onSnapshot(querySnapshot => {
          const items = querySnapshot.docs.map(doc => doc);
          var v = [];
          for (i = 0; i < items.length; i += 3) {
            var content;
            if(i + 2 < items.length){
            content = `
                <div class= "container mt-3">
                    <div class = "row">
                    <div class = "col-lg-3 ms-lg-5">  
                        <div class="card  d-flex justify-content-center mx-auto text-center bg-light mt-3" style  = "border-radius: 5%">
                          <img  id = "img1"  class = "img-fluid card-img-top" src="${items[i].data().img}" style = "background: 50% 50% no-repeat; /* 50% 50% centers image in div */
                          object-fit: cover;height: 250px;">
                            <div class="card-body">
                              <h5 class="card-title">${items[i].data().title}</h5>
                              <p class="card-text text-break">${items[i].data().article.slice(0, 80)}...</p>
                              <a href="#post/${items[i].id}" class="btn btn-outline-dark">View blog page</a>
                              <button id = "${items[i].id}" hidden = "true" class= "btn btn-danger"  onclick = "Deletepost(id)">Delete</button>
                            </div>
                        </div>
                      </div>
                      <div class = "col-lg-3 offset-lg-1">  
                        <div class="card d-flex justify-content-center mx-auto text-center bg-light mt-3" style  = "border-radius: 5%">
                        <img  id = "img1"  class = "img-fluid card-img-top" src="${items[i + 1].data().img}" style = "background: 50% 50% no-repeat; /* 50% 50% centers image in div */
                        object-fit: cover; height: 250px;">
                            <div class="card-body">
                              <h5 class="card-title">${items[i + 1].data().title}</h5>
                              <p class="card-text text-break">${items[i + 1].data().article.slice(0, 80)}...</p>
                              <a href="#post/${items[i + 1].id}" class="btn btn-outline-dark">View blog page</a>
                              <button id = "${items[i + 1].id}" hidden = "true" class= "btn btn-danger"  onclick = "Deletepost(id)">Delete</button>
                            </div>
                        </div>
                      </div>
                      <div class = "col-lg-3 offset-lg-1">  
                        <div class="card d-flex justify-content-center mx-auto text-center bg-light mt-3" style  = "border-radius: 5%">
                        <img  id = "img1"  class = "img-fluid card-img-top" src="${items[i + 2].data().img}" style = "background: 50% 50% no-repeat; /* 50% 50% centers image in div */
                        object-fit: cover;height: 250px;">
                            <div class="card-body">
                              <h5 class="card-title">${items[i + 2].data().title}</h5>
                              <p class="card-text text-break">${items[i + 2].data().article.slice(0, 80)}...</p>
                              <a href="#post/${items[i + 2].id}" class="btn btn-outline-dark">View blog page</a>
                              <button id = "${items[i + 2].id}" hidden = "true" class= "btn btn-danger"  onclick = "Deletepost(id)">Delete</button>
                            </div>
                        </div>
                      </div>
                      
                    </div>
                    
                  </div>`;
            }
            else
              if(i + 1 < items.length){
                content = `
                <div class= "container mt-3">
                <div class = "row">
                  <div class = "col-lg-4 offset-lg-2">  
                    <div class="card w-75 d-flex justify-content-center mx-auto text-center  bg-light mt-3"  style = " border-radius: 5%;">
                    <img  id = "img1"  class = "img-fluid card-img-top" src="${items[i].data().img}" style = "background: 50% 50% no-repeat; /* 50% 50% centers image in div */
                    object-fit: cover;height: 250px;">
                        <div class="card-body">
                          <h5 class="card-title">${items[i].data().title}</h5>
                          <p class="card-text text-break">${items[i].data().article.slice(0, 80)}...</p>
                          <a href="#post/${items[i].id}" class="btn btn-outline-dark">View blog page</a>
                          <button id = "${items[i].id}" hidden = "true" class= "btn btn-danger"  onclick = "Deletepost(id)">Delete</button>
                        </div>
                    </div>
                  </div>
                  <div class = "col-lg-4">  
                    <div class="card w-75 d-flex justify-content-center mx-auto text-center bg-light mt-3" style  = "border-radius: 5%">
                    <img  id = "img1"  class = "img-fluid card-img-top" src="${items[i + 1].data().img}" style = "background: 50% 50% no-repeat; /* 50% 50% centers image in div */
                    object-fit: cover;height: 250px;">
                        <div class="card-body">
                          <h5 class="card-title">${items[i + 1].data().title}</h5>
                          <p class="card-text text-break">${items[i + 1].data().article.slice(0, 80)}...</p>
                          <a href="#post/${items[i + 1].id}" class="btn btn-outline-dark">View blog page</a>
                          <button id = "${items[i + 1].id}" hidden = "true" class= "btn btn-danger"  onclick = "Deletepost(id)">Delete</button>
                        </div>
                    </div>
                  </div>
                  
                </div>
                
              </div>`;
              }
              else{
                content = `
                <div class= "container mt-3">
                <div class = "row">
                  <div class = "col-lg-4 d-flex justify-content-center mx-auto text-center" >  
                    <div class="card w-75   bg-light mt-3"  style = " border-radius: 5%;">
                    <img  id = "img1"  class = "img-fluid card-img-top" src="${items[i].data().img}" style = "background: 50% 50% no-repeat; /* 50% 50% centers image in div */
                    object-fit: cover;height: 250px;">
                        <div class="card-body">
                          <h5 class="card-title">${items[i].data().title}</h5>
                          <p class="card-text text-break">${items[i].data().article.slice(0, 80)}...</p>
                          <a href="#post/${items[i].id}" class="btn btn-outline-dark">View blog page</a>
                          <button id = "${items[i].id}" hidden = "true" class= "btn btn-danger"  onclick = "Deletepost(id)">Delete</button>
                        </div>
                    </div>
                  </div>
                  
                </div>
                
              </div>`;
              }
              v.push(content);
          }
          var now = parseInt( url[1]);
         
          var pagination = `
        <nav aria-label="Page navigation example" class = "mt-5">
          <ul class="pagination pagination justify-content-center">
            <li class="page-item disabled" id = "pag">
              <a class="page-link text-dark" href="#" tabindex="-1" aria-disabled="true">Previous</a>
            </li>
            <li class="page-item"><a class="page-link bg-dark text-white" href="#home/${now}">${now}</a></li>
            <li class="page-item"><a class="page-link text-dark" href="#home/${now + 1}">${now + 1}</a></li>
            <li class="page-item"><a class="page-link text-dark" href="#home/${now + 2}">${now + 2}</a></li>
            <li class="page-item">
              <a class="page-link text-dark" href="#home/${now + 1}">Next</a>
            </li>
          </ul>
        </nav>`;
           
          if(now == 1){
             presentation = `
             <div class = "container-fluid">
             <div class="card mb-3 mt-3 bg-light d-flex justify-content-center mx-auto text-center" style = "max-width : 1025px">
               <div class="row ">
                 <div >
                   <div class="card-body">
                     <h5 class="card-title">Isciuc Iustin</h5>
                     <p class="card-text">This is a responsive web  personal blog app made with vanilla javascript and firebase , is simply to use and very fun.</p>
                   </div>
                 </div>
               </div>
             </div>
           </div>
             `;
             document.getElementById("main").innerHTML = presentation;
           }
           else 
            document.getElementById("main").innerHTML = "";
          var start = parseInt(3 * (now - 1));
          for(i = start; i < Math.min(v.length ,(start + 3)); i++)
           document.getElementById("main").innerHTML += v[i];
           document.getElementById("main").innerHTML += pagination;
           
           if(now > 1){
            document.getElementById("pag").className = "page-item";
          }
          if(start + 6 > v.length)
           document.getElementsByClassName("page-item")[3].className = "page-item disabled";
          if(start + 3 >= v.length){
            var x =  document.getElementsByClassName("page-item");
            for(i = 2; i < x.length; i++)
              x[i].className = "page-item disabled";
          }
          if(username == "Iustin Constantin"){
             var x = document.getElementsByClassName("btn btn-danger");
             for(i = 0; i < x.length; i++)
              x[i].hidden = false;

          }
        });
    });

  }
}
if (!location.hash) {
  location.hash = "#home/1";
  ok = true;
}
loadContent();
window.addEventListener("hashchange", loadContent);

function Afis(id) {
  document.getElementById(id + "set").hidden = !document.getElementById(id + "set").hidden;
}
function Delete(id) {
  db.collection("comments").doc(id).delete();
  var idiv = id + "idiv";
  var x = db.collection('comments')
    .orderBy('createdAt', 'desc')
    .onSnapshot(querySnapshot => {
      querySnapshot.docs.map(doc => {
        if (doc.data().idiv == idiv)
          db.collection("comments").doc(doc.id).delete();
      });
    });
    db.collection("comments").get().then(function (querySnapshot) {
      cntcomments = 0;
      querySnapshot.docs.map((doc) => {
        if (doc.data().url == url[1])
          cntcomments++;
      })
      if(url[0] == "post")
        document.getElementById("comment-number").innerHTML = cntcomments + " Comments";
    });
}
function Deletepost(id) {
  db.collection("post").doc(id).get().then((doc) => {
    firebase.storage().refFromURL(doc.data().img).delete();
    db.collection("post").doc(id).delete();
  });
  db.collection("comments").where('url' , '==', id).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        Delete(doc.id);
    });
  });
}
function Edit(id) {
  var cancel = document.getElementById(id + "cancel");
  var save = document.getElementById(id + "save");
  var txt = document.getElementById(id + "txt");
  var prevtxt = txt.innerText;
  cancel.hidden = save.hidden = false;
  txt.contentEditable = true;
  cancel.onclick = () => {
    cancel.hidden = save.hidden = true;
    txt.contentEditable = false;
    txt.innerText = prevtxt;
  }
  save.onclick = () => {
    var query = db.collection('comments').doc(id);
    query.update({
      comment: txt.innerText
    });
  }
}
function Reply(id) {
  var idiv = id + "idiv";
  var reply = document.getElementById(id + "reply");
  var div = document.getElementById(idiv);
  document.getElementById(idiv).hidden = !document.getElementById(idiv).hidden;
  document.getElementById(id + "list").hidden = !document.getElementById(id + "list").hidden;
  document.getElementById(id + "list2").hidden = false;
  auth.onAuthStateChanged(user => {
    if (user) {
      reply.onclick = () => {
        var text = document.getElementById(id + "replytxt").innerText;
        document.getElementById(id + "replytxt").innerText = "";
        const { serverTimestamp } = firebase.firestore.FieldValue;
        db.collection('comments').add({
          name: user.displayName,
          comment: text,
          createdAt: serverTimestamp(),
          idiv: idiv,
          img: user.photoURL,
          url : url[1]
        });
        db.collection("comments").get().then(function (querySnapshot) {
          cntcomments = 0;
          querySnapshot.docs.map((doc) => {
            if (doc.data().url == url[1])
              cntcomments++;
          })
          document.getElementById("comment-number").innerHTML = cntcomments + " Comments";
        });
      }
      var x = db.collection('comments')
        .orderBy('createdAt', 'desc')
        .onSnapshot(querySnapshot => {
          var comentari = querySnapshot.docs.map(doc => {
            if (doc.data().idiv == idiv)
              return `<li class="list-group-item" style = "border:none">
                              <div class = "row">
                                  <div class = "row">
                                      <span class="badge bg-outline-light text-dark col-1 offset-1">${doc.data().name}</span>
                                  <div>
                                  <div class = "row">
                                      <div class = "col-md-1 col-2">
                                          <img src="${doc.data().img}" class = "img-fluid rounded-circle float-end w-75">
                                      </div>
                                      <div class = "col-md-10 col-9">
                                          <span contenteditable="false"  class="form-control text-break" aria-label="With textarea" role="textbox"> ${doc.data().comment}</span>
                                      </div>
                                  <div>
                              </div>
                          </li>`
          });
          document.getElementById(id + "list").innerHTML = comentari.join('');

        });
    }
  });
}
function Show(id) {
  var idiv = id + "idiv";
  var valoare = document.getElementsByName(id + "show");
  if (valoare[0].value == "Show reply")
    valoare[0].value = "Hidden reply";
  else
    valoare[0].value = "Show reply";
  document.getElementById(idiv).hidden = !document.getElementById(idiv).hidden;
  document.getElementById(id + "list").hidden = !document.getElementById(id + "list").hidden;
  document.getElementById(id + "list2").hidden = true;
  auth.onAuthStateChanged((user) => {
    var x = db.collection('comments')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        var comentari = querySnapshot.docs.map(doc => {
          if (doc.data().idiv == idiv && doc.data().name != user.displayName) {
            return `<li class="list-group-item" style = "border:none">
                              <div class = "row">
                                  <div class = "row">
                                      <span class="badge bg-outline-light text-dark col-1 offset-1">${doc.data().name}</span>
                                  <div>
                                  <div class = "row">
                                      <div class = "col-md-1 col-3">
                                          <img src="${doc.data().img}" class = "img-fluid rounded-circle float-end w-75">
                                      </div>
                                      <div class = "col-md-10 col-7">
                                          <span contenteditable="false"  class="form-control text-break" aria-label="With textarea" role="textbox"> ${doc.data().comment}</span>
                                      </div>
                                  <div>
                              </div>
                          </li>`
          }
          else
            if (doc.data().idiv == idiv) {
              return `<li class="list-group-item" style = "border:none">
                              <div class = "row">
                                  <div class = "row">
                                      <div class = "row ">
                                          <span class="badge bg-outline-light text-dark col-1 offset-1">${doc.data().name}</span>
                                      </div>
                                      <div class = "col-md-1 col-3">
                                          <img src="${doc.data().img}" class = "img-fluid rounded-circle float-end w-75">
                                      </div>
                                      <div class = "col-md-10 col-7">
                                          <span contenteditable="false" id = "${doc.id + "txt"}"   class="form-control text-break" aria-label="With textarea" role="textbox"> ${doc.data().comment}</span>
                                      </div>
                                      <div class = "col-1">
                                          <div class="dropdown">
                                              <button  class="btn btn-outline-lightdropdown" type="button" id="${doc.id + "set"}" data-bs-toggle="dropdown" aria-expanded="false">
                                                  <i class="fa fa-ellipsis-v"></i>
                                              </button>
                                              <ul class="dropdown-menu" aria-labelledby="set">
                                                  <button id = "${doc.id}" class="dropdown-item" onclick = "Edit(id)" >Edit</button>
                                                  <button id = "${doc.id}" class="dropdown-item" onclick = "Delete(id)">Delete</button>
                                              </ul>
                                          </div>
                                      </div>
                                  </div>

                                  <div class = "container">
                                      <button hidden = "true" id = "${doc.id + "cancel"}" class = "btn btn-secondary btn-sm col-lg-1 offset-lg-8 col-4 offset-3" text-break>CANCEL</button>
                                      <button hidden = "true" id = "${doc.id + "save"}" class = "btn btn-primary btn-sm  col-lg-1 col-3">SAVE</button>
                                  </div>
                              </div>
                          </li>`
            }
        });
        document.getElementById(id + "list").innerHTML = comentari.join('');

      });
  });
}
$(window).on("load", function(){
  setTimeout(function(){
  $(".loader-wraper").fadeOut("slow");
}, 200)
})