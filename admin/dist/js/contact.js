let firebaseConfig = {
  apiKey: "AIzaSyC44JZDjg-m7O9GoBSEV-eDb1yRkbt2tI0",
  authDomain: "localhost",
  projectId: "cpelab-1d394",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

$("#submit").click(() => {
  event.preventDefault()
  if($("#firstname").val()!=""){
  db.collection("users").add({firstname:$("#firstname").val(),lastname:$("#lastname").val(),email:$("#email").val(),gender:$('input[name=gender]:checked').val(),detail:$("#detail").val()})
  .then(function(docRef) {
          // console.log("Document written with ID: ", docRef.id);
          if(!isNaN(docRef.id.charAt(0))){
              delete_data(docRef)
              write_data()
          }
          location.reload();
      })
      .catch(function(error) {
          // console.error("Errosr adding document: ", error);
      });
}else{
  alert("please enter require information")
}
})

db.collection("users").orderBy("gender")
    .onSnapshot(function(snapshot) {
        $("#contact .row").html("")
        snapshot.forEach(doc=>{
            // console.log(typeof(doc.id))
            $("#contact .row").append(`
             <div class="col-sm-3 col-sm-6 col-xs-12">
            <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">
              ${doc.data().firstname} ${doc.data().lastname}
              </br>
              ${doc.data().gender} 
              </br>
              ${censoring(doc.data().email)} 
              </h3>
            </div>
              <div class="box-body">  
              
              <div class="col-sm-6 col-sm-6 col-xs-6">
              <button class="btn btn-primary" data-toggle="modal" data-target="#${doc.id}">visit </button>
            </div>
            
            <div class="col-sm-6 col-sm-6 col-xs-6">
              <button class="btn btn-danger pull-right" id="delete" onclick="delete_data(${doc.id})">delete</button>
              </div>
              
              </div>
              </div>
              <div class="modal fade" id="${doc.id}" role="dialog">
              <div class="modal-dialog">
              </div>
              <div class="col-md-4"></div>
              <div class="col-md-4">
                <!-- Modal content-->
                <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Contact</h4>
                  </div>
                  <div class="modal-body">
                    <p>Name : ${doc.data().firstname} ${doc.data().lastname}</p><br>
                    <p>Gender : ${doc.data().gender}</p><br>
                    <p>Email : ${doc.data().email}</p><br>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-default pull-right" data-dismiss="modal">Close</button>
                  </div>
                </div>
                
              </div>
              </div> 
              </div>
              </div>
              `)
        });
    });

function validateEmail(email) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

db.collection("users").orderBy("gender")
.onSnapshot(function(snapshot) {
    data=[]
    data.push(snapshot.docs.filter(data=>{return data.data().gender==="male"}).length)
    data.push(snapshot.docs.filter(data=>{return data.data().gender==="female"}).length)
    data.push(snapshot.docs.filter(data=>{return data.data().gender==="other"}).length)
    console.log(data)
    drawchart(data)
});

function drawchart(data){
var donutChartCanvas = $('#donutChart').get(0).getContext('2d')
var donutData        = {
  labels: [
      'male', 
      'female',
      'other',
  ],
  datasets: [
    {
      data: [data[0],data[1],data[2]],
      backgroundColor : ['#f56954', '#00a65a', '#f39c12'],
    }
  ]
}
var donutOptions     = {
  maintainAspectRatio : false,
  responsive : true,
}
//Create pie or douhnut chart
// You can switch between pie and douhnut using the method below.
var donutChart = new Chart(donutChartCanvas, {
  type: 'doughnut',
  data: donutData,
  options: donutOptions      
})
}



function write_data(){
  event.preventDefault()
  if($("#firstname").val()!=""){
  db.collection("users").add({firstname:$("#firstname").val(),lastname:$("#lastname").val(),email:$("#email").val(),gender:$('input[name=optionsRadios]:checked').val(),detail:$("#detail").val()})
  .then(function(docRef) {
          // console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
          // console.error("Error adding document: ", error);
      });
}
}

function delete_data(id){
  // console.log(typeof(id.id))
  db.collection("users").doc(id.id).delete().then(function() {
      // console.log("Document successfully deleted!");
      location.reload();
  }).catch(function(error) {
      // console.error("Error removing document: ", error);
  })
}

function censoring(data){
  var data_x = data[0];
  for(var i = 1 ; i<data.length;i++){
      if(data[i]!="@" && data[i]!="."){
          data_x+="X"
      }else{
          data_x+=data[i]
      }
  }
  return data_x
}    


