var express = require("express");
var exe = require("./connection");
var route = express.Router();
function checkAdminLogin(req,res,next)
{
    req.session.admin_id = 1;
    if(req.session.admin_id == undefined)
        res.redirect("/login");
    if(req.session.admin_id != undefined)
        next();
}
route.get("/",checkAdminLogin,async function(req,res)
{
    res.render("admin/home.ejs");
});

// =====================================================================================================
// Home page start-------------------------------------------------------------------------------------------------
// ==================================================================================================

route.get("/slider",checkAdminLogin, async (req,res)=>{

    const slider_data = await exe(`SELECT * FROM slider_tbl`)
    res.render("admin/slider.ejs",{"slider_data":slider_data})
})

route.post("/save_slider",checkAdminLogin, async (req, res) => {
    const d = req.body;
    let slider_image = '';

    if (req.files && req.files.slider_image) {
         slider_image = Math.random().toFixed(4) + " " + req.files.slider_image.name;
        req.files.slider_image.mv("public/img/" + slider_image);
    }

    const sql = `INSERT INTO slider_tbl (slider_title, slider_description, slider_image) VALUES ('${d.slider_title}', '${d.slider_description}', '${slider_image}')`;
    const data = await exe(sql);

    // res.send(data);
    res.redirect('/admin/slider')
});

// Edit Slider 

route.get("/edit_slider/:id",checkAdminLogin, async (req,res)=>{
    var id = req.params.id;
    const slider_data =await exe(`SELECT * FROM slider_tbl WHERE slider_id ='${id}'`)
    res.render("admin/edit_slider.ejs",{"slider_data":slider_data})
});

route.post("/update_slider",checkAdminLogin, async (req, res) => {
    const d = req.body;
 
    let slider_image = d.current_image;
    if (req.files && req.files.slider_image) {
        slider_image = Math.random().toFixed(4) + " " + req.files.slider_image.name;
        req.files.slider_image.mv("public/img/" + slider_image);
    }

    const sql =` UPDATE slider_tbl SET slider_title = '${d.slider_title}', slider_description ='${ d.slider_description}', slider_image ='${ slider_image}' WHERE slider_id = '${d.slider_id}'`;

    const data = await exe(sql);
    // res.send(data);
    res.redirect("/admin/slider")
});

route.get("/delete_slider/:id",checkAdminLogin,async (req,res) => {
    const id = req.params.id;
    const sql =`DELETE FROM slider_tbl WHERE slider_id ='${id}'`;
    const data = await exe(sql)
    // res.send(data)
    res.redirect("/admin/slider")
});

// SLIDER API'S

route.get("/sliderapi",async (req,res)=>{
    var slider= await exe(`SELECT * FROM slider_tbl`)
    res.send(slider)
})


// UNLOCK 

route.get("/unlock_section",checkAdminLogin,async (req,res) =>{
    const unlock_data = await exe(`SELECT * FROM unlock_section`)
    res.render("admin/unlock_section.ejs",{"unlock_data":unlock_data})
});

route.post("/save_unlock",async (req,res)=>{
    const d = req.body;
    let unlock_image = '';

    if (req.files && req.files.unlock_image) {
         unlock_image = Math.random().toFixed(4) + " " + req.files.unlock_image.name;
        req.files.unlock_image.mv("public/img/" + unlock_image);
    }
    const sql =` INSERT INTO unlock_section (unlock_title,unlock_image) VALUES ('${d.unlock_title}','${unlock_image}')`;
    const data =await exe(sql)
    // res.send(data)
    res.redirect("/admin/unlock_section")
});


route.get("/edit_unlock/:id",checkAdminLogin,async (req,res)=>{
    const id =req.params.id;
    const unlock_data =await exe(`SELECT * FROM unlock_section WHERE unlock_id ='${id}'`)
    res.render("admin/edit_unlock.ejs",{"unlock_data":unlock_data})
});

route.post("/update_unlock", async (req, res) => {
    const d = req.body;

    let unlock_image = d.current_image;

    if (req.files && req.files.unlock_image) {
        unlock_image = Math.random().toFixed(4) + " " + req.files.unlock_image.name;
        req.files.unlock_image.mv("public/img/" + unlock_image);
    }

    const sql =` UPDATE unlock_section SET unlock_title ='${d.unlock_title}', unlock_image = '${unlock_image}' WHERE unlock_id = '${d.unlock_id}'`;

    const data = await exe(sql);
    res.redirect("/admin/unlock_section");
});

route.get("/delete_unlock/:id",checkAdminLogin,async (req,res)=>{
    const id = req.params.id;
    const sql =`DELETE FROM unlock_section WHERE unlock_id ='${id}'`;
    const data =await exe(sql)
    // res.send(data)
    res.redirect("/admin/unlock_section");

});

//UNLOCK_SECTION API'S

route.get("/unlock_sectionapi",async (req,res)=>{
    var unlock_section= await exe(`SELECT * FROM unlock_section`)
    res.send(unlock_section)
})


// APP SECTION 

route.get("/app_section",checkAdminLogin, async (req,res)=> {
    const app_data =await exe(`SELECT * FROM application_section`)
    res.render('admin/app_section.ejs',{"app_data":app_data})
});

route.post("/save_app",checkAdminLogin, async (req,res)=>{
  const d =req.body;
    if(req.files && req.files.app_image){
        var app_image =Math.random().toFixed(4)+" "+req.files.app_image.name;
        req.files.app_image.mv("public/img/" +app_image)
    }
    const sql =`INSERT INTO application_section (app_title,app_subtitle,app_desc,app_image) VALUES ('${d.app_title}','${d.app_subtitle}','${d.app_desc}','${app_image}')`;
    const data =await exe(sql)
//   res.send(data)
res.redirect("/admin/app_section")
});


route.get("/edit_app/:id",checkAdminLogin,async (req,res) =>{
    const id =req.params.id;
    const app_data =await exe(`SELECT * FROM application_section WHERE app_id ='${id}'`);
     res.render("admin/edit_app.ejs",{"app_data":app_data})
});

route.post("/update_app",checkAdminLogin, async (req, res) => {
    const d = req.body;
    let app_image = d.current_image;

    if (req.files && req.files.app_image) {
        app_image = Math.random().toFixed(4) + " " + req.files.app_image.name;
        req.files.app_image.mv("public/img/" + app_image);
    }

    const sql =` UPDATE application_section SET app_title ='${d.app_title}', app_subtitle ='${d.app_subtitle}', app_desc ='${d.app_desc}', app_image ='${app_image}' WHERE app_id ='${d.app_id}'`;
    const data = await exe(sql);
    res.redirect("/admin/app_section");
});

route.get("/delete_app/:id",checkAdminLogin,async (req,res) =>{
    const id =req.params.id
    const sql =`DELETE FROM application_section WHERE app_id ='${id}'`;
    const data = await exe(sql)
    // res.send(data)
    res.redirect("/admin/app_section");
})

// APP API'S

route.get("/app_sectionapi",async (req,res)=>{
    var app_section= await exe(`SELECT * FROM application_section`)
    res.send(app_section)
})


// LANDMARK SECTION 

route.get("/landmark_section",checkAdminLogin,async (req,res)=>{
    const landmark_data =await exe(`SELECT * FROM landmark_data`)
    res.render("admin//landmark_section.ejs",{"landmark_data":landmark_data})
});

route.post("/save_landmark",checkAdminLogin, async (req,res) =>{
    const d = req.body;
    
    if(req.files && req.files.card_logo) {
        var card_logo =Math.random().toFixed(4)+" "+ req.files.card_logo.name;
        req.files.card_logo.mv("public/img/" +card_logo)
    }
    const sql =`INSERT INTO landmark_data (landmark_title,landmark_subtitleONe,landmark_subtitleTwo,card_title,card_logo,card_desc) VALUE ('${d.landmark_title}','${d.landmark_subtitleONe}','${d.landmark_subtitleTwo}','${d.card_title}','${card_logo}', '${d.card_desc}')`;
    const data =await exe(sql)
    // res.send(data)
    res.redirect("/admin/landmark_section")
});


route.get("/edit_landmark/:id",checkAdminLogin,async (req,res)=>{
    const landmark_data =await exe(`SELECT * FROM landmark_data`)
    res.render("admin/edit_landmark.ejs",{"landmark_data":landmark_data})
});

route.post("/update_landmark",checkAdminLogin, async (req, res) => {
    const d = req.body;
    let card_logo = d.current_image;
    
    if (req.files && req.files.card_logo) {
        card_logo = Math.random().toFixed(4) + " " + req.files.card_logo.name;
        req.files.card_logo.mv("public/img/" + card_logo);
    }

    const sql =`UPDATE landmark_data SET landmark_title ='${d.landmark_title}', landmark_subtitleONe ='${d.landmark_subtitleONe}',landmark_subtitleTwo ='${d.landmark_subtitleTwo}',card_title ='${d.card_title}', card_logo ='${card_logo}', card_desc ='${d.card_desc}' WHERE landmark_id ='${d.landmark_id}'`;
    const data =await exe(sql)
    // res.send(data)
    res.redirect("/admin/landmark_section")

});

route.get("/delete_landmark/:id",checkAdminLogin,async (req,res)=>{
    const id = req.params.id;
    const sql =`DELETE FROM landmark_data WHERE landmark_id ='${id}'`;
    const data =await exe(sql)
    // res.send(data)
    res.redirect("/admin/landmark_section")

});

// LANDMARK API'S

route.get("/landmark_sectionapi",async (req,res)=>{
    var landmark_section= await exe(`SELECT * FROM landmark_data`)
    res.send(landmark_section)
})

// EXPLORE SECTION 

route.get("/explore_section",checkAdminLogin,async (req,res) =>{

    const explore_data =await exe(`SELECT * FROM explore_sec`)
    res.render("admin/explore_section.ejs",{"explore_data":explore_data})
});

route.post("/save_explore",checkAdminLogin,async (req,res)=>{
    var d = req.body;
    if(req.files && req.files.exp_card_img){
        var exp_card_img =Math.random().toFixed(4)+" "+ req.files.exp_card_img.name;
        req.files.exp_card_img.mv("public/img/" +exp_card_img)
    }
    const sql =`INSERT INTO explore_sec (explore_title,explore_desc,exp_card_img,exp_card_title) VALUES ('${d.explore_title}','${d.explore_desc}','${exp_card_img}','${d.exp_card_title}')`;
    const data =await exe(sql)
    // res.send(data)
    res.redirect("/admin/explore_section")
});

route.get("/edit_explore/:id",checkAdminLogin,async (req,res)=>{
    var id =req.params.id;
    const explore_data =await exe(`SELECT * FROM explore_sec WHERE explore_id ='${id}'`)
    res.render("admin/edit_explore.ejs",{"explore_data":explore_data})
});

route.post("/update_explore",checkAdminLogin, async (req, res) => {
    const d = req.body;
    let exp_card_img = d.current_image;

    if (req.files && req.files.exp_card_img) {
        exp_card_img = Math.random().toFixed(4) + " " + req.files.exp_card_img.name;
        req.files.exp_card_img.mv("public/img/" + exp_card_img);
    }

    const sql = `UPDATE explore_sec SET 
                    explore_title = '${d.explore_title}', 
                    explore_desc = '${d.explore_desc}', 
                    exp_card_img = '${exp_card_img}', 
                    exp_card_title = '${d.exp_card_title}' 
                WHERE explore_id = '${d.explore_id}'`;

    const data = await exe(sql);
    // res.send(data);
    res.redirect("/admin/explore_section")

});

route.get("/delete_explore/:id",checkAdminLogin, async (req,res)=>{
    const id = req.params.id;
    const sql =`DELETE FROM explore_sec WHERE explore_id ='${id}'`;
    const data =await exe(sql)
    // res.send(data)
    res.redirect("/admin/explore_section")

});

// EXPLORE API'S

route.get("/explore_sectionapi",async (req,res)=>{
    var explore_section= await exe(`SELECT * FROM explore_sec`)
    res.send(explore_section)
})

// FOUNDER CEO SECTION 

route.get("/founde_ceo_sec",checkAdminLogin,async (req,res)=>{
    const founder_detail =await exe(`SELECT * FROM founder_sec`)
    res.render("admin/founde_ceo_sec.ejs",{"founder_detail":founder_detail})
});

route.post("/save_founder",checkAdminLogin,async (req,res)=>{
    var d =req.body;
    if(req.files && req.files.founder_image){
        var founder_image =Math.random().toFixed(4)+" "+ req.files.founder_image.name;
        req.files.founder_image.mv("public/img/" +founder_image)
    }

    const sql =`INSERT INTO founder_sec (founder_image,founder_name,founder_position) VALUES ('${founder_image}','${d.founder_name}','${d.founder_position}')`;

    const data =await exe(sql)
    // res.send(data)
    res.redirect("/admin/founde_ceo_sec")
});

route.get("/edit_founder/:id",checkAdminLogin,async (req,res)=>{
    var id = req.params.id;
    const founder_detail =await exe(`SELECT * FROM founder_sec WHERE founder_id='${id}'`)
    res.render("admin/edit_founder.ejs",{"founder_detail":founder_detail})
});

route.post("/update_founder",checkAdminLogin, async (req, res) => {
    const d = req.body;
    let founder_image = d.current_image;

    if (req.files && req.files.founder_image) {
        founder_image = Math.random().toFixed(4) + " " + req.files.founder_image.name;
        req.files.founder_image.mv("public/img/" + founder_image);
    }

    const sql = `UPDATE founder_sec SET 
                    founder_image = '${founder_image}', 
                    founder_name = '${d.founder_name}', 
                    founder_position = '${d.founder_position}' 
                WHERE founder_id = '${d.founder_id}'`;

    const data = await exe(sql);
    res.redirect("/admin/founder_ceo_sec");
});


route.get("/delete_founder/:id",checkAdminLogin,async (req,res)=>{
    var id = req.params.id;
    const sql =`DELETE FROM founder_sec WHERE founder_id ='${id}'`;
    const data =await exe(sql)
    // res.send(data)
    res.redirect("/admin/founder_ceo_sec");

});

// FOUNDER AND CEO API'S

route.get("/founde_ceo_secapi",async (req,res)=>{
    var founde_ceo_sec= await exe(`SELECT * FROM founder_sec`)
    res.send(founde_ceo_sec)
})

// =====================================================================================================
// Home page end-------------------------------------------------------------------------------------------------
// ==================================================================================================



// ======================================================================================================
// About us page   start-------------------------------------------------------------------------------------------------
// ======================================================================================================

route.get("/About_Front_section",checkAdminLogin,async function(req,res){
    var About = await exe("SELECT * FROM About_tbl"); 
    res.render("admin/Front_Section.ejs",{"About":About});
});

route.post("/save_About_Front_section",checkAdminLogin,async function(req,res){
    var About_image = new Date().getTime()+req.files.About_image.name;
    req.files.About_image.mv("public/img/"+About_image);
    var d = req.body;
    var sql =`INSERT INTO About_tbl(About_Heading,About_Title,About_Description,About_bg_image) VALUES ('${d.About_Heading}','${d.About_Title}','${d.About_Description}','${About_image}')`;
    var data = await exe(sql);
    res.redirect("/admin/About_Front_section");
});

route.get("/delete_About_Front_section/:id",checkAdminLogin,async function(req,res){
    var id=req.params.id;
    var data = await exe(`DELETE FROM About_tbl WHERE About_id='${id}'`);
    // res.send("DONE");
    res.redirect("/admin/About_Front_section");
});

route.get("/edit_About_Front_section/:id",checkAdminLogin,async function(req,res){
    id = req.params.id;
   var data=await exe(`SELECT * FROM About_tbl WHERE About_id='${id}'`);
   res.render("admin/ed_Front_Section.ejs",data[0]);
});

route.post("/update_About_Front_section",checkAdminLogin,async function(req,res){
    // var Edit_About_image = new Date().getTime()+req.files.Edit_About_image.name;
    // req.files.Edit_About_image.mv("public/img/"+Edit_About_image);
    var d=req.body;
    

    let Edit_About_image = d.current_image;
    if (req.files) {
        console.log(req.files);
        Edit_About_image = Math.random().toFixed(4) + " " + req.files.Edit_About_image.name;
        req.files.Edit_About_image.mv("public/img/" + Edit_About_image);
    }

   var sql=`UPDATE About_tbl SET About_Heading='${d.Edit_About_Heading}',About_Title='${d.Edit_About_Title}',About_Description='${d.Edit_About_Description}',About_bg_image='${Edit_About_image}' WHERE About_id='${d.About_id}'`;
   await exe(sql);
   res.redirect("/admin/About_Front_section"); 
});   

route.get('/About_Front_sectionapi',async function(req,res){
         var About = await exe("SELECT * FROM About_tbl"); 
         res.send(About)
 });


route.get("/About_Our_section",checkAdminLogin,async function(req,res){
    var vision = await exe("SELECT * FROM vision_tbl"); 
    var mission = await exe("SELECT * FROM mission_tbl"); 
    res.render("admin/Our_section.ejs",{"vision":vision,"mission":mission});
});

route.post("/save_Our_Mission_section",checkAdminLogin,async function(req,res){
    var d = req.body;
    var sql =`INSERT INTO mission_tbl(mission_title,mission_desc) VALUES ('${d.Mission_title}','${d.Mission_desc}')`;
    var data = await exe(sql);
    res.redirect("/admin/About_Our_section");
});

route.get("/delete_Our_Mission_section/:id",checkAdminLogin,async function(req,res){
    var id=req.params.id;
    var data = await exe(`DELETE FROM mission_tbl WHERE mission_id='${id}'`);
    // res.send("DONE");
    res.redirect("/admin/About_Our_section");
});

route.get("/edit_Our_Mission_section/:id",checkAdminLogin,async function(req,res){
    id = req.params.id;
   var data=await exe(`SELECT * FROM mission_tbl WHERE mission_id='${id}'`);
   res.render("admin/ed_Our_Mission.ejs",data[0]);
});

route.post("/update_Our_Mission_section",checkAdminLogin,async function(req,res){
    var d=req.body;
   var sql=`UPDATE mission_tbl SET mission_title='${d.Edit_Mission_title}',mission_desc='${d.Edit_Mission_desc}' WHERE mission_id='${d.mission_id}'`;
   await exe(sql);
   res.redirect("/admin/About_Our_section"); 
});   

route.get('/Our_Mission_sectionapi',async function(req,res){
         var mission = await exe("SELECT * FROM mission_tbl"); 
         res.send(mission)
 });

route.post("/save_Our_Vision_section",checkAdminLogin,async function(req,res){
    var d = req.body;
    var sql =`INSERT INTO vision_tbl(vision_title,vision_desc) VALUES ('${d.Vision_title}','${d.Vision_desc}')`;
    var data = await exe(sql);
    res.redirect("/admin/About_Our_section");
});

route.get("/delete_Our_Vision_section/:id",checkAdminLogin,async function(req,res){
    var id=req.params.id;
    var data = await exe(`DELETE FROM vision_tbl WHERE vision_id='${id}'`);
    // res.send("DONE");
    res.redirect("/admin/About_Our_section");
});

route.get("/edit_Our_Vision_section/:id",checkAdminLogin,async function(req,res){
    id = req.params.id;
   var data=await exe(`SELECT * FROM vision_tbl WHERE vision_id='${id}'`);
   res.render("admin/ed_Our_Vision.ejs",data[0]);
});


route.post("/update_Our_Vision_section",checkAdminLogin,async function(req,res){
    var d=req.body;
   var sql=`UPDATE vision_tbl SET vision_title='${d.Edit_Vision_title}',vision_desc='${d.Edit_Vision_desc}' WHERE vision_id='${d.vision_id}'`;
   await exe(sql);
   res.redirect("/admin/About_Our_section"); 
});   

route.get('/Our_Vision_sectionapi',async function(req,res){
         var vision = await exe("SELECT * FROM vision_tbl"); 
         res.send(vision)
 });

route.get("/About_Our_Core",checkAdminLogin,async function(req,res){
    var core = await exe("SELECT * FROM core_tbl"); 
    res.render("admin/Our_core.ejs",{"core":core});
});

route.post("/save_About_Our_Core",checkAdminLogin,async function(req,res){
    var d = req.body;
    var sql =`INSERT INTO core_tbl(core_title,core_desc,core_icons) VALUES ('${d.core_title}','${d.core_desc}','${d.core_icons}')`;
    var data = await exe(sql);
    res.redirect("/admin/About_Our_Core");
});

route.get("/delete_About_Our_Core/:id",checkAdminLogin,async function(req,res){
    var id=req.params.id;
    var data = await exe(`DELETE FROM core_tbl WHERE core_id='${id}'`);
    // res.send("DONE");
    res.redirect("/admin/About_Our_Core");
});

route.get("/edit_About_Our_Core/:id",checkAdminLogin,async function(req,res){
    id = req.params.id;
   var data=await exe(`SELECT * FROM core_tbl WHERE core_id='${id}'`);
   res.render("admin/ed_Our_Core.ejs",data[0]);
});

route.post("/update_About_Our_Core",checkAdminLogin,async function(req,res){
    var d=req.body;
   var sql=`UPDATE core_tbl SET core_title='${d.Edit_core_title}',core_desc='${d.Edit_core_desc}',core_icons='${d.Edit_core_icons}' WHERE core_id='${d.core_id}'`;
   await exe(sql);
   res.redirect("/admin/About_Our_Core"); 
});  

route.get('/About_Our_Core_sectionapi',async function(req,res){
    var core = await exe("SELECT * FROM core_tbl"); 
    res.send(core);
});

// route.get("/About_Client_section",checkAdminLogin,async function(req,res){
//     var client = await exe("SELECT * FROM client_review_tbl"); 
//     var logo = await exe("SELECT * FROM company_logo_tbl"); 
//     res.render("admin/About_Client_Section.ejs",{"client":client,"logo":logo});
// });

route.get("/About_Client",checkAdminLogin,async function(req,res){
    var client1 = await exe("SELECT * FROM client_review_tbl"); 
    var logo = await exe("SELECT * FROM company_logo_tbl"); 
    res.render("admin/About_Client_Section.ejs",{"client1":client1,"logo":logo});
});

route.post("/save_About_Client_review_Information",checkAdminLogin,async function(req,res){
    // var About_image = new Date().getTime()+req.files.About_image.name;
    // req.files.About_image.mv("public/img/"+About_image);
    var d = req.body;
    var sql =`INSERT INTO client_review_tbl(client_name,client_post,client_review_desc) VALUES ('${d.Client_name}','${d.Client_post}','${d.Client_desc}')`;
    var data = await exe(sql);
    res.redirect("/admin/About_Client");
});

route.post("/save_About_Company_logo_Information",checkAdminLogin,async function(req,res){
    var logo_image = new Date().getTime()+req.files.Client_Company_logo.name;
    req.files.Client_Company_logo.mv("public/img/"+logo_image);
    var d = req.body;
    var sql =`INSERT INTO company_logo_tbl(company_name,company_logo_image) VALUES ('${d.Company_name}','${logo_image}')`;
    var data = await exe(sql);
    res.redirect("/admin/About_Client");
});


route.get("/delete_About_client_section/:id",checkAdminLogin,async function(req,res){
    var id=req.params.id;
    var data = await exe(`DELETE FROM client_review_tbl WHERE client_id='${id}'`);
    // res.send("DONE");
    res.redirect("/admin/About_Client");
});

route.get("/delete_About_logo_section/:id",checkAdminLogin,async function(req,res){
    var id=req.params.id;
    var data = await exe(`DELETE FROM company_logo_tbl WHERE company_id='${id}'`);
    // res.send("DONE");
    res.redirect("/admin/About_Client");
});

route.get("/edit_About_client_section/:id",checkAdminLogin,async function(req,res){
    id = req.params.id;
   var data=await exe(`SELECT * FROM client_review_tbl WHERE client_id='${id}'`);
   res.render("admin/ed_About_client_Review.ejs",data[0]);
});

route.post("/update_About_client_review_Information",checkAdminLogin,async function(req,res){
    var d=req.body;
   var sql=`UPDATE client_review_tbl SET client_name='${d.Edit_Client_name}',client_post='${d.Edit_Client_post}',client_review_desc='${d.Edit_Client_desc}' WHERE client_id='${d.Edit_Client_id}'`;
   await exe(sql);
   res.redirect("/admin/About_Client"); 
}); 

route.get('/About_client_reviewapi',async function(req,res){
    var client1 = await exe("SELECT * FROM client_review_tbl"); 
    res.send(client1)
});

route.get('/About_client_logoapi',async function(req,res){
    var logo = await exe("SELECT * FROM company_logo_tbl"); 
    res.send(logo)
});

// =======================================================================================================================================================================================================================
// About Us Page section end--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ==========================================================================================================================================================================================================================


// ============================================================================================================================================================================================================================
// Career Page section start---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ====================================================================================================================================================================================================

route.get("/Career_Front_section",checkAdminLogin,async function(req,res){
    var Career = await exe("SELECT * FROM Career_tbl"); 
    res.render("admin/Career_Front_Section.ejs",{"Career":Career});
});

route.post("/save_Career_Front_section",checkAdminLogin,async function(req,res){
    var Career_image = new Date().getTime()+req.files.Career_bg_image.name;
    req.files.Career_bg_image.mv("public/img/"+Career_image);
    var d = req.body;
    var sql =`INSERT INTO Career_tbl(career_title,career_desc,career_image) VALUES ('${d.Career_Title}','${d.Career_Desc}','${Career_image}')`;
    var data = await exe(sql);
    res.redirect("/admin/Career_Front_section");
});

route.get("/delete_Career_Front_section/:id",checkAdminLogin,async function(req,res){
    var id=req.params.id;
    var data = await exe(`DELETE FROM Career_tbl WHERE career_id='${id}'`);
    // res.send("DONE");
    res.redirect("/admin/Career_Front_section");
});

route.get("/edit_Career_Front_section/:id",checkAdminLogin,async function(req,res){
    id = req.params.id;
   var data=await exe(`SELECT * FROM Career_tbl WHERE career_id='${id}'`);
   res.render("admin/ed_Career_Front_Section.ejs",data[0]);
});

route.post("/update_Career_Front_section",checkAdminLogin,async function(req,res){
    // var Edit_Career_image = new Date().getTime()+req.files.Edit_Career_image.name;
    // req.files.Edit_Career_image.mv("public/img/"+Edit_Career_image);
    var d=req.body;
    let Edit_career_image = d.current_image;
    if (req.files) {
        console.log(req.files);
        Edit_career_image = Math.random().toFixed(4) + " " + req.files.Edit_career_image.name;
        req.files.Edit_career_image.mv("public/img/" + Edit_career_image);
    }
   
   var sql=`UPDATE Career_tbl SET career_title='${d.Edit_Career_Title}',career_desc='${d.Edit_Career_Description}',career_image='${Edit_career_image}' WHERE career_id='${d.career_id}'`;
   await exe(sql);
   res.redirect("/admin/Career_Front_section"); 
});   

route.get('/Career_Front_sectionapi',async function(req,res){
         var Career = await exe("SELECT * FROM Career_tbl"); 
         res.send(Career)
 });


 route.get("/Career_Our_Culture_section",checkAdminLogin,async function(req,res){
    var Culture = await exe("SELECT * FROM culture_tbl"); 
    var data = await exe("SELECT * FROM culture_key_factors"); 
    res.render("admin/Career_Culture_Section.ejs",{"Culture":Culture,"Data":data});
});

route.post("/save_Career_Culture_section",checkAdminLogin,async function(req,res){
    var Culture_bg_image = new Date().getTime()+req.files.Culture_bg_image.name;
    req.files.Culture_bg_image.mv("public/img/"+Culture_bg_image);
    var d = req.body;
    var sql =`INSERT INTO Culture_tbl(culture_heading,culture_title1,culture_title2,culture_image) VALUES ('${d.culture_heading}','${d.culture_title1}','${d.culture_title2}','${Culture_bg_image}')`;
    var data = await exe(sql);
    res.redirect("/admin/Career_Our_Culture_section");
});

route.post("/save_Career_Culture_key_factors",checkAdminLogin,async function(req,res){
    var d = req.body;
    var sql =`INSERT INTO Culture_key_factors(Culture_key_factors_points) VALUES ('${d.Culture_key_factors_points}')`;
    var data = await exe(sql);
    res.redirect("/admin/Career_Our_Culture_section");
});


route.get("/delete_Career_Culture_section/:id",checkAdminLogin,async function(req,res){
    var id=req.params.id;
    var data = await exe(`DELETE FROM Culture_tbl WHERE culture_id='${id}'`);
    // res.send("DONE");
    res.redirect("/admin/Career_Our_Culture_section");
});

route.get("/delete_Career_Culture_key_factors/:id",checkAdminLogin,async function(req,res){
    var id=req.params.id;
    var data = await exe(`DELETE FROM Culture_key_factors WHERE Culture_key_factors_id='${id}'`);
    // res.send("DONE");
    res.redirect("/admin/Career_Our_Culture_section");
});


route.get("/edit_Career_Culture_section/:id",checkAdminLogin,async function(req,res){
    id = req.params.id;
   var data=await exe(`SELECT * FROM Culture_tbl WHERE culture_id='${id}'`);
   res.render("admin/ed_Career_Culture_section.ejs",data[0]);
});

route.post("/update_Career_Culture_section",checkAdminLogin,async function(req,res){
    // var Edit_culture_image = new Date().getTime()+req.files.Edit_culture_image.name;
    // req.files.Edit_culture_image.mv("public/img/"+Edit_culture_image);
    var d=req.body;
    
    let Edit_culture_image = d.current_image;
    if (req.files) {
        console.log(req.files);
        Edit_culture_image = Math.random().toFixed(4) + " " + req.files.Edit_culture_image.name;
        req.files.Edit_culture_image.mv("public/img/" + Edit_culture_image);
    }

   var sql=`UPDATE culture_tbl SET culture_heading='${d.Edit_culture_heading}',culture_title1='${d.Edit_culture_title1}',culture_title2='${d.Edit_culture_title2}',culture_image='${Edit_culture_image}' WHERE culture_id='${d.Edit_culture_id}'`;
   await exe(sql);
   res.redirect("/admin/Career_Our_Culture_section"); 
});

route.get('/Career_Culture_sectionapi',async function(req,res){
    var culture = await exe("SELECT * FROM culture_tbl"); 
    res.send(culture)
});


route.get('/Career_Culture_key_factorsapi',async function(req,res){
    var Factors = await exe("SELECT * FROM Culture_key_factors"); 
    res.send(Factors)
});


route.get("/car_middle_sec",checkAdminLogin, async (req,res) =>{
    var career_data =await exe(`SELECT * FROM car_mid_sec`) 
    res.render("admin/car_middle_sec.ejs",{"career_data":career_data})
})

route.post("/save_midSec",checkAdminLogin, async (req,res) =>{
    const d =req.body;
    const sql =`INSERT INTO car_mid_sec(middle_title,middle_logo) VALUES ('${d.middle_title}','${d.middle_logo}')`;
    const data =await exe(sql)
    // res.send(data)
    res.redirect("/admin/car_middle_sec")
});

route.get("/edit_car_mid_sec/:id",checkAdminLogin,async (req,res)=>{
    var id =req.params.id;
    var career_data =await exe(`SELECT * FROM car_mid_sec WHERE car_mid_sec_id ='${id}'`) 
    res.render("admin/edit_car_mid_sec.ejs",{"career_data":career_data})
});

route.post("/update_midSec",checkAdminLogin, async (req,res)=>{
    const d =req.body;
    const sql =`UPDATE car_mid_sec SET middle_title ='${d.middle_title}', middle_logo ='${d.middle_logo}' WHERE car_mid_sec_id ='${d.car_mid_sec_id}'`;
    const data =await exe(sql)
    // res.send(data)
    res.redirect("/admin/car_middle_sec")
});

route.get("/delete_car_mid_sec/:id",checkAdminLogin, async (req,res)=>{
    const id = req.params.id;
    const sql =`DELETE FROM car_mid_sec WHERE car_mid_sec_id ='${id}'`
    const data =await exe(sql)
    // res.send(data)
    res.redirect("/admin/car_middle_sec")
})

// CARRIER MIDDLE SECTION API'S

route.get("/car_middle_secapi",async (req,res)=>{
    var car_middle_sec= await exe(`SELECT * FROM founder_sec`)
    res.send(car_middle_sec)
})


route.get("/Career_Resume_section",checkAdminLogin,async function(req,res){
    var Resume = await exe("SELECT * FROM resume_tbl"); 
    res.render("admin/Career_Resume_Section.ejs",{"resume":Resume});
});

route.post("/save_Career_resume_section",checkAdminLogin,async function(req,res){
    var resume_bg_image = new Date().getTime()+req.files.resume_image.name;
    req.files.resume_image.mv("public/img/"+resume_bg_image);
    var d = req.body;
    var sql =`INSERT INTO resume_tbl(resume_heading,resume_title,resume_link,resume_image) VALUES ('${d.resume_heading}','${d.resume_title}','${d.resume_link}','${resume_bg_image}')`;
    var data = await exe(sql);
    res.redirect("/admin/Career_Resume_section");
});

route.get("/edit_Career_resume_section/:id",checkAdminLogin,async function(req,res){
    id = req.params.id;
   var data=await exe(`SELECT * FROM resume_tbl WHERE resume_id='${id}'`);
   res.render("admin/ed_Career_Resume_section.ejs",data[0]);
});

route.post("/update_Career_resume_section",checkAdminLogin,async function(req,res){
    // var Edit_Resume_image = new Date().getTime()+req.files.Edit_Resume_image.name;
    // req.files.Edit_Resume_image.mv("public/img/"+Edit_Resume_image);
    var d=req.body;

    let resume_image = d.current_image;
    if (req.files) {
        console.log(req.files);
        resume_image = Math.random().toFixed(4) + " " + req.files.Edit_Resume_image.name;
        req.files.Edit_Resume_image.mv("public/img/" + resume_image);
    }

   var sql=`UPDATE resume_tbl SET resume_heading='${d.Edit_Resume_heading}',resume_title='${d.Edit_Resume_title}',resume_link='${d.Edit_Resume_Link}',resume_image='${resume_image}' WHERE resume_id='${d.Edit_Resume_id}'`;
   await exe(sql);
   res.redirect("/admin/Career_Resume_section"); 
});

route.get("/delete_Career_resume_section/:id",checkAdminLogin,async function(req,res){
    var id=req.params.id;
    var data = await exe(`DELETE FROM resume_tbl WHERE resume_id='${id}'`);
    // res.send("DONE");
    res.redirect("/admin/Career_Resume_section");
});

route.get('/Career_resume_sectionapi',async function(req,res){
    var resume = await exe("SELECT * FROM resume_tbl"); 
    res.send(resume)
});



route.post("/save_contact_form",checkAdminLogin,async function(req,res){
    var d = req.body;
    var sql =`INSERT INTO contact_us(contact_person_name,contact_person_email,contact_person_subject,contact_person_message) VALUES ('${d.name}','${d.email}','${d.subject}','${d.message}')`;
    var data = await exe(sql);
    });


    route.get("/contact_form",checkAdminLogin,async function(req,res){
        var contact = await exe("SELECT * FROM contact_us"); 
        res.render("admin/Contact_Section.ejs",{"contact":contact});
        });    


route.get("/delete_contact_infomation_section/:id",checkAdminLogin,async function(req,res){
            var id=req.params.id;
            var data = await exe(`DELETE FROM contact_us WHERE contact_id='${id}'`);
            // res.send("DONE");
            res.redirect("/admin/contact_form");
});







module.exports = route;
