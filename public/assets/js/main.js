const create_btn = document.getElementById('create-btn');
const blur_box = document.querySelector('.blur-box');
const create_btn_close = document.getElementById('create_btn_close');


if(create_btn){
    create_btn.onclick = ()=>{
        blur_box.style.display = "block";
        blur_box.style.opacity = "1";
    }
}
if(create_btn_close){
    create_btn_close.onclick = ()=>{
        blur_box.style.display = "none";
        blur_box.style.opacity = "0";
    }
    
}

// profile Image preview
const profile_pic = document.getElementById('profile_pic');

if(profile_pic){
    profile_pic.onchange =(e)=>{

        const profile_img = document.querySelector('.profile_img');
        const url = URL.createObjectURL(e.target.files[0])

        profile_img.setAttribute('src',url);

    }
}

// Cover Image Preview
const cover_pic = document.getElementById('cover_pic');

if(cover_pic){
    cover_pic.onchange =(e)=>{

        const cover_img = document.querySelector('.cover_img');
        const url = URL.createObjectURL(e.target.files[0])

        cover_img.setAttribute('src',url);

    }
}
// Gallery Image Preview
const gal_file = document.getElementById('gal_file');

if(gal_file){
    gal_file.onchange =(e)=>{

        const showGalleryImg = document.querySelector('.showGalleryImg');

        let file = e.target.files;
        let image = '';

        for(let i = 0; i < file.length; i++){

            const url = URL.createObjectURL(file[i]);
            
            image += `    <div class="gal_image_show">
            <img src="${url} " alt="">
        </div>
            `
        }

        showGalleryImg.innerHTML = image;

        

    }
}


